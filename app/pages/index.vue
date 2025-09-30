<template>  
  <!-- <div class="m-8 grid grid-rows-4"> -->

    <div class="border text-sm p-4">

      <new-wallet></new-wallet>
      <!-- <div class="p-4"> -->

        <!-- <p>Address: {{ address }}</p> -->
        <!-- <p>Balance: {{ balance }}</p> -->
      <!-- </div> -->
    </div>
    

    <!-- <hr>
    <div class="border">
      <div class="grid grid-cols-3 gap-4">
        <input class="border p-2 m-4 col-span-2" v-model="to" placeholder="Recipient Address">
        <input class="border p-2 m-4" v-model="amount" placeholder="Amount ETH">
  
      </div>
      <button class="border w-full p-4 m-2 border-white " @click="sendEth()">Send ETH</button>  -->

    <!-- </div> -->
  <!-- </div> -->
</template>


<script setup lang="ts">
// async function sendEth() {
//   if (!wallet) { alert("Create wallet first."); return; }
//   if (!to.value.trim() || !amount.value.trim()) { alert("Fill recipient and amount"); return; }

//   try {
//     let res = await wallet.sendTransaction({
//       to: to.value.trim(),
//       value: ethers.parseEther(amount.value)
//     });
//     tx.value = res.hash;
//     await res.wait();
//     alert("✅ Transaction confirmed");
//   } catch (err) {
//     alert("Error: " + err.message);
//   }
// }
</script>
