<template>

	<div class="flex items-center pb-2">
		<div class="flex flex-row flex-1 gap-4">
			<label><input v-model="walletMode" type="radio" name="word-count" :value=12 class="mx-2">12-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=15 class="mx-2">15-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=18 class="mx-2">18-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=21 class="mx-2">21-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=24 class="mx-2">24-word</label>
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
		<!-- <input class="border p-2 m-4 col-span-2" v-model="mnemonicInput" placeholder="Enter mnemonic"> -->
		<hr>
		<p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
		<div v-if="wallet" class="mx-2">
			<p v-if="wallet">Address: {{ wallet.address }}</p>
			<p v-if="balance">Balance: {{ balance }} ETH</p>
			<br>
			<p>Seed: {{ wallet.mnemonic }}</p>
			<br>
		</div>

		<div v-if="wallet" class="mx-2">
			<wallet-actions />
		</div>

	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { WalletMode } from '~/types';

const walletMode = ref<WalletMode>(12);
const { wallet, generate } = useCreate(walletMode);

async function generateWallet(): Promise<void> {
	await generate();
	console.log(wallet.value)
}
// const { txHash, sendTx } = useWallet();

// async function handleSend() {
//   await sendTx("0x1234...abcd", "0.1");
// }

// Interface for server response
// interface BalanceResponse {
// 	balance: string
// }




// const res = await wallet
// if (res) {
// 	const mnemonic: string = res.value.mnemonic
// 	const address = res.address
// 	const wordCount = res.wordCount
// } 

const balance = ref<string>('')
const mnemonicInput = ref<string>('')
const lock = ref<boolean>(false)

const errorMessage = ref<string>('')
// const wallet = ref<HDNodeWallet | null>(null)

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