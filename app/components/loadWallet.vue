<template>
	<div class="flex flex-row gap-4">
		<input type="radio" name="12-word" value=12>12-word<br>
		<input type="radio" name="24-word" value=24>24-word<br>
	</div>
	<div class="grid grid-cols-3 gap-4">
		<div v-show="is12Word" class="flex flex-wrap justify-evenly gap-2">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
			<input type="text" class="border">
		</div>
		<input class="border p-2 m-4 col-span-2" v-model="mnemonic" placeholder="Enter mnemonic">
		<button class="border border-black p-2 m-4" @click="createWallet()">Create Wallet</button>
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
const mnemonic = ref<string>('')
const errorMessage = ref<string>('')
const wallet = ref<HDNodeWallet | null>(null)
const is12Word = ref<boolean>(false)

async function createWallet() {
  try {
    if (!import.meta.client) return

    const mnemonicValue = mnemonic.value.trim()
    if (mnemonicValue) {
      if (!ethers.Mnemonic.isValidMnemonic(mnemonicValue)) {
        errorMessage.value = 'Invalid mnemonic phrase'
        return
      }
      wallet.value = ethers.Wallet.fromPhrase(mnemonicValue)
    } else {
      wallet.value = ethers.Wallet.createRandom()

			console.log(wallet.value) // dev
			

      errorMessage.value = 'New wallet created. Save your mnemonic securely!'
    }

    address.value = wallet.value.address

    // Fetch balance from server route
    const response = await $fetch<BalanceResponse>('/api/getBalance', {
      method: 'POST',
      body: { address: wallet.value.address },
    })
    balance.value = response.balance
  } catch (error) {
    errorMessage.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}
// watch(hexInput, (newValue) => {
//     if (newValue && !/^[0-9A-Fa-f]*$/.test(newValue)) {
//         qrError.value = 'Please enter a valid hexadecimal string'
//     } else {
//         qrError.value = ''
//     }
// })

</script>