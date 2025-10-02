<template>
    <div class="grid grid-cols-2 w-full items-center justify-center text-center">
        <div class="flex flex-col gap-4 mx-8">
            <button @click="isDeposit = true" class="border p-4" active-class="bg-black"
                :class="[isDeposit ? 'border-cyan-300' : '']">Deposit</button>
            <button @click="isDeposit = false" class="border p-4"
                :class="[!isDeposit ? 'border-cyan-300' : '']">Withdraw</button>

        </div>
        <div>
            <div v-show="isDeposit" class="flex justify-center">
                <qrcode-vue :value="hexInput" :size="200" level="H" render-as="svg" />
            </div>
            <div v-show="!isDeposit" class="flex gap-2 flex-col">
                <label>To: <input v-model="to" placeholder="0x..."/></label>
                <label>Amount: <input v-model="amount" type="number" placeholder="ETH" /></label>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

const to = ref<string>('')
const amount = ref<string>('')

// This will be a prop
const hexInput = ref<string>('0x294897f04cfA7de68aE6c76553CE4Cb520261624')
const qrError = ref<string>('')

const isDeposit = ref<boolean>(true)

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

watch(hexInput, (newValue) => {
    if (newValue && !/^[0-9A-Fa-f]*$/.test(newValue)) {
        qrError.value = 'Please enter a valid hexadecimal string'
    } else {
        qrError.value = ''
    }
})
</script>

<style scoped>
button {
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover,
button:active,
button.active {
    background-color: #f0f0f0;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>