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
        <input class="border p-2 m-4 col-span-2" v-model="mnemonic"
            placeholder="Enter mnemonic">
        <button class="border border-black p-2 m-4" @click.prevent="createWallet()">Create Wallet</button>
    </div>
</template>

<script type="module">
import { ethers } from "ethers";
import { ref } from 'vue';
import dotenv from 'dotenv';

let wallet, provider;
const address = ref('');
const balance = ref('');
const mnemonic = ref('');
const is12Word = ref(true);

async function createWallet() {
  let m = mnemonic.value.trim();
  wallet = m ? ethers.Wallet.fromMnemonic(m) : ethers.Wallet.createRandom();


  if (!m) alert("Generated mnemonic:\n" + wallet.mnemonic.phrase);

  address.value = wallet.address;

  provider = new ethers.JsonRpcProvider(
    "https://eth-mainnet.alchemyapi.io/v2/" + process.env.API_KEY
  );
  wallet = wallet.connect(provider);

  const bal = await provider.getBalance(wallet.address);
  balance.value = ethers.formatEther(bal)
}
</script>