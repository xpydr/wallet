<template>

	<div class="flex items-center pb-2">
		<div class="flex flex-row flex-1 gap-4">
			<label><input v-model="walletMode" type="radio" name="word-count" :value=12 class="mx-2">12-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=15 class="mx-2">15-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=18 class="mx-2">18-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=21 class="mx-2">21-word</label>
			<label><input v-model="walletMode" type="radio" name="word-count" :value=24 class="mx-2">24-word</label>
		</div>
		<button class="border border-black p-2 overflow-hidden min-w-fit border-cyan-300 text-cyan-300" @click="createWallet(walletMode)">
			Generate
		</button>

	</div>
	<div class="flex flex-col gap-4">
		<!-- <input class="border p-2 m-4 col-span-2" v-model="mnemonicInput" placeholder="Enter mnemonic"> -->
		<hr>
		<p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
		<div v-if="wallet" class="mx-2">
			<p v-if="address">Address: {{ address }}</p>
			<p v-if="balance">Balance: {{ balance }} ETH</p>
			<br>
			<p>Seed: {{ wallet.mnemonic?.phrase ?? 'Error' }}</p>
			{{console.log(wallet.mnemonic?.phrase ?? 'Error')}}
			<br>
		</div>
		
		<div v-if="wallet" class="mx-2">
			<wallet-actions></wallet-actions>
		</div>

	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ethers, HDNodeWallet } from 'ethers'

// Interface for server response
interface BalanceResponse {
	balance: string
}

// Reactive state
const address = ref<string>('')
const balance = ref<string>('')
const mnemonicInput = ref<string>('')

const errorMessage = ref<string>('')
const wallet = ref<HDNodeWallet | null>(null)
const walletMode = ref<12 | 15 | 18 | 21 | 24>(12)

async function fetchBalance(address: string): Promise<void> {
	// Fetch balance from server route
	const response = await $fetch<BalanceResponse>('/api/getBalance', {
		method: 'POST',
		body: { address: address },
	})
	balance.value = response.balance
}

async function createWallet(wordCount: 12 | 15 | 18 | 21 | 24): Promise<{
	address: string;
	mnemonic: string;
	wordCount: number;
}> {

	try {
		// Map word count to entropy size (in bits)
		const entropyBits: Record<number, number> = {
			12: 128,
			15: 160,
			18: 192,
			21: 224,
			24: 256,
		}

		const bits = entropyBits[wordCount];
		if (!bits) {
			throw new Error("Invalid word count. Choose 12, 15, 18, 21, or 24.")
		}

		// Convert bits to bytes 
		const entropyBytes = bits / 8;

		// Generate random entropy
		const entropy = ethers.randomBytes(entropyBytes);

		// Create mnemonic from entropy
		const mnemonic = ethers.Mnemonic.fromEntropy(entropy);

		// Create HD wallet from mnemonic 
		wallet.value = ethers.Wallet.fromPhrase(mnemonic.phrase);

		console.log(wallet.value);

		address.value = wallet.value.address
		fetchBalance(wallet.value.address)

		return {
			address: wallet.value.address,
			mnemonic: mnemonic.phrase,
			wordCount: mnemonic.phrase.split(" ").length,
		};
	} catch (error) {
		errorMessage.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
		return {
			address: "",
			mnemonic: "",
			wordCount: 0,
		};
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