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
			<p v-if="myWallet">Address: {{ myWallet?.address }}</p>
			<p v-if="myWallet">Balance: {{ myWallet?.balance }} ETH</p>
			<br>
			<p>Seed: {{ myWallet?.mnemonic }}</p>
			<br>
		</div>
		<div v-if="myWallet" class="mx-2">
			<div class="grid grid-cols-2 w-full items-center justify-center text-center">
				<div class="flex flex-col gap-4 mx-8 mb-8">
					<button @click="isDeposit = true" class="border p-4" active-class="bg-black"
						:class="[isDeposit ? 'border-cyan-300' : '']">Deposit</button>
					<button @click="isDeposit = false" class="border p-4"
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
import type { WalletMode } from '~/types';

const walletModes = [12, 15, 18, 21, 24]

const walletMode = ref<WalletMode>(12);
const error = ref<any>(null);
const { txHash, sendTx } = useWallet();
const to = ref<string>('')
const amountInEther = ref<string>('')
const isDeposit = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const lock = ref<boolean>(false)

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
		const res = await sendTx("0xaea0Bd7AF7E1f6BC5d2Caf508Ceb195040352A9b", "0.01");
		console.log(res)
		console.log(txHash.value)
	} catch (err: any) {
		console.error(err)
		error.value = err.message
	} finally {
		isLoading.value = false
	}
}
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