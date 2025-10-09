<template>
	<div class="flex items-center pb-2">
		<div class="flex flex-row flex-1 gap-4">
			<label v-for="mode in walletModes"> <!-- select mnemonic word count -->
				<input v-model="walletMode" type="radio" name="word-count" :value="mode" class="mx-2">{{ mode }}-word
			</label>
		</div>
		<div class="mx-4 hover:cursor-pointer" @click="lock = !lock">
			<Icon v-if="lock" name="zondicons:lock-closed" size="24" />
			<Icon v-else name="bxs:lock-open" size="24" />
		</div>
		<button v-if="!lock" class="border border-black p-2 overflow-hidden min-w-fit border-cyan-300 text-cyan-300"
			@click="generateWallet">
			Generate
		</button>
		<div v-else title="Locked"
			class="border border-black p-2 overflow-hidden min-w-fit border-cyan-300 text-cyan-300 bg-black hover:cursor-not-allowed">
			Generate
		</div>
	</div>
	<div class="flex flex-col gap-4">
		<hr>
		<p v-if="error" class="text-red-500">{{ error }}</p>
		<div v-if="myWallet" class="mx-2">
			<div class="flex items-center gap-2">
				<p>Address: {{ myWallet?.address }}</p>
				<a :href="`https://sepolia.etherscan.io/address/${myWallet?.address}`" target="_blank" rel="noopener noreferrer">
					<Icon name="gridicons:external" class="text-cyan-300 hover:cursor-pointer" size="24" />
				</a>
			</div>
			<br>
			<div class="flex items-center gap-2">
				<p>Balance: {{ myWallet?.balance }} ETH</p> 
				<Icon @click="refreshBalance" class="text-cyan-300 hover:cursor-pointer" name="material-symbols:refresh-rounded" size="24" />
			</div>
			<br>
			<p>Seed: {{ myWallet?.mnemonic }}</p>
			<br>
		</div>
		<div v-if="myWallet" class="mx-2">
			<div class="grid grid-cols-2 w-full items-center justify-center text-center">
				<div class="flex flex-col items-center gap-4 mb-8">
					<button @click="isDeposit = true" class="border p-4 w-48" active-class="bg-black"
						:class="[isDeposit ? 'border-cyan-300' : '']">Deposit</button>
					<button @click="isDeposit = false" class="border p-4 w-48"
						:class="[!isDeposit ? 'border-cyan-300' : '']">Withdraw</button>
				</div>
				<div>
					<div v-show="isDeposit" class="flex justify-center">
						<qrcode-vue :value="myWallet?.address" :size="150" foreground="black" background="white"
							level="H" render-as="svg" />
					</div>
					<div v-show="!isDeposit && !isLoading" class="flex gap-2 flex-col text-left m-4">
						<label class="flex gap-2">To: <input v-model="to" placeholder="0x..." class="w-full" /></label>
						<label class="flex gap-2">Amount: <input v-model="amountInEther" type="number" placeholder="ETH"
								class="w-full" /></label>
						<button @click="handleSend" class="border p-2">Send</button>
					</div>
				</div>
				<p v-if="txHash && !isDeposit" class="flex gap-2">
					Tx: <a v-if="txHash && !isDeposit" :href="`https://sepolia.etherscan.io/tx/${txHash}`"
						target="_blank" rel="noopener noreferrer">{{ txHash }}</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QrcodeVue from 'qrcode.vue';
import type { EthAddress, WalletMode } from '~/types';

const walletModes = [12, 15, 18, 21, 24]

const walletMode = ref<WalletMode>(12);
const error = ref<any>(null);
const { txHash, sendTx } = useWallet();
const { balance, fetch } = useFetchBalance();
const to = ref<string>('');
const amountInEther = ref<string>('');
const isDeposit = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const lock = ref<boolean>(false);

interface Wallet {
	address?: string;
	balance?: string;
	wordCount?: number;
	mnemonic?: string;
}

const myWallet = ref<Wallet | null>(null);

async function generateWallet(): Promise<void> {
	try {
		const { wallet, generate } = await useCreate(walletMode.value)
		myWallet.value = wallet.value;
		await generate();
	} catch (err: any) {
		console.error(err.message)
		error.value = err.message;
	}
}

async function handleSend() {
	try {
		isLoading.value = true
		await sendTx(to.value, amountInEther.value);
	} catch (err: any) {
		error.value = err.message
	} finally {
		isLoading.value = false
	}
}

async function refreshBalance() {
  try {
    isLoading.value = true;
    const address = myWallet?.value?.address;
    if (!isValidEthAddress(address)) {
      throw new Error('Invalid or missing Ethereum address');
    }
    const res = await fetch(address);
  } catch (err: any) {
    console.error('Failed to fetch balance:', err.message);
  } finally {
    isLoading.value = false;
  }
}

const isValidEthAddress = (address: string | null | undefined): address is EthAddress => {
  return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address);
};

watch(to, (newValue) => {
	if (newValue && !/^0x([a-fA-F0-9]{2})+$/.test(newValue)) {
		error.value = 'Please enter a valid hexadecimal string'
	} else {
		error.value = ''
	}
})
</script>

<style scoped>
label {
	cursor: pointer;
}

input[type="radio"] {
	cursor: pointer;
}

button {
	cursor: pointer;
	transition: background-color 0.2s;
}

button:hover {
	background-color: #f0f0f0;
}

button:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}
</style>