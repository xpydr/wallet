<template>
  <div class="m-16">
    <div class="text-center">
      <Icon class="text-cyan-400" name="la:spider" size="48" />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <input class="border p-2 m-4 col-span-2" v-model="mnemonic"
        placeholder="Enter mnemonic (leave blank to generate)">
      <button class="border border-black p-2 m-4" @click="createWallet()">Create Wallet</button>
    </div>

    <div class="border p-2 flex">
      <p>Address: {{ address }}</p>
      <p>Balance: {{ balance }}</p>
    </div>


    <hr>

    <input v-model="to" placeholder="Recipient Address">
    <input v-model="amount" placeholder="Amount ETH">
    <button @click="sendEth()">Send ETH</button>
    <p :="tx">{{ tx }}</p>
  </div>
</template>


<script type="module">
import { ethers } from "ethers";

let wallet, provider;
const address = ref('');
const balance = ref('');
const mnemonic = ref('');
const amount = ref('');

async function createWallet() {
  let m = mnemonic.value.trim();
  wallet = m ? ethers.Wallet.fromMnemonic(m) : ethers.Wallet.createRandom();


  if (!m) alert("Generated mnemonic:\n" + wallet.mnemonic.phrase);

  address.value = wallet.address;

  provider = new ethers.JsonRpcProvider(
    "https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_KEY"
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
