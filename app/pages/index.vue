<template>
  <div class="m-16">

    <div class="border p-2">

      <div class="grid grid-cols-3 gap-4">
        <input class="border p-2 m-4 col-span-2" v-model="mnemonic"
          placeholder="Enter mnemonic (leave blank to generate)">
        <button class="border border-black p-2 m-4" @click.prevent="createWallet()">Create Wallet</button>
      </div>
      <div>

        <p>Address: {{ address }}</p>
        <p>Balance: {{ balance }}</p>
      </div>
    </div>


    <hr>
    <div class="grid grid-cols-3 gap-4">
      <input class="border p-2 m-4 col-span-2" v-model="to" placeholder="Recipient Address">
      <input class="border p-2 m-4" v-model="amount" placeholder="Amount ETH">

    </div>
    <button class="border w-full p-4 m-2 border-white " @click="sendEth()">Send ETH</button>
    <p :="tx">{{ tx }}</p>
  </div>
</template>


<script type="module">
import { ethers } from "ethers";
import dotenv from 'dotenv';

let wallet, provider;
const address = ref('');
const balance = ref('');
const mnemonic = ref('');
const amount = ref('');

const createWallet = async () => {
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

async function sendEth() {
  if (!wallet) { alert("Create wallet first."); return; }
  if (!to.value.trim() || !amount.value.trim()) { alert("Fill recipient and amount"); return; }

  try {
    let res = await wallet.sendTransaction({
      to: to.value.trim(),
      value: ethers.parseEther(amount.value)
    });
    tx.value = res.hash;
    await res.wait();
    alert("✅ Transaction confirmed");
  } catch (err) {
    alert("Error: " + err.message);
  }
}
</script>
