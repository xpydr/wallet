<template>
	<div class="flex flex-row gap-4">
		<label><input v-model="walletMode" type="radio" name="12-word" value=12 class="mx-2">12-word</label>
		<label><input v-model="walletMode" type="radio" name="15-word" value=15 class="mx-2">15-word</label>
		<label><input v-model="walletMode" type="radio" name="18-word" value=18 class="mx-2">18-word</label>
		<label><input v-model="walletMode" type="radio" name="21-word" value=21 class="mx-2">21-word</label>
		<label><input v-model="walletMode" type="radio" name="24-word" value=24 class="mx-2">24-word</label>
	</div>
	<div class="grid grid-cols-3 gap-4">
		<input class="border p-2 m-4 col-span-2" v-model="mnemonicInput" placeholder="Enter mnemonic">
		<button class="border border-black p-2 m-4" @click="createWallet(walletMode)">Create Wallet</button>
		<div>
			<p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
			<p v-if="address">Address: {{ address }}</p>
			<p v-if="balance">Balance: {{ balance }} ETH</p>
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

function createWallet(wordCount: 12 | 15 | 18 | 21 | 24): {
	address: string;
	mnemonic: string;
	privateKey: string;
	wordCount: number;
} {

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
			privateKey: wallet.value.privateKey,
			wordCount: mnemonic.phrase.split(" ").length,
		};
	} catch (error) {
		errorMessage.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
	}
}
</script>

<style scoped>
label:hover input:hover {
	cursor: pointer;
}
</style>