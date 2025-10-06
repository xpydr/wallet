<template>
    <div class="grid grid-cols-2 w-full items-center justify-center text-center">
        <div class="flex flex-col gap-4 mx-8 mb-8">
            <button @click="isDeposit = true" class="border p-4" active-class="bg-black"
                :class="[isDeposit ? 'border-cyan-300' : '']">Deposit</button>
            <button @click="isDeposit = false" class="border p-4"
                :class="[!isDeposit ? 'border-cyan-300' : '']">Withdraw</button>
        </div>
        <div>
            <!-- Deposit and withdraw actions -->
            <div v-show="isDeposit" class="flex justify-center">
                <qrcode-vue :value="props.hexInput" :size="150" foreground="black" background="white" level="H"
                    render-as="svg" />
            </div>
            <div v-show="!isDeposit" class="flex gap-2 flex-col text-left m-4">
                <label>To: <input v-model="to" placeholder="0x..." class="w-7/8" /></label>
                <label>Amount: <input v-model="amount" type="number" placeholder="ETH" class="w-1/4" /></label>
                <button @click="sendEth" class="border p-2">Send</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    hexInput: string
}

const props = defineProps<Props>();

import QrcodeVue from 'qrcode.vue';

const to = ref<string>('')
const amount = ref<string>('')

// This will be a prop
const hexInput = ref<string>('0xC4EFD40AdbBE23120D87Ff56dfb61555A2fe02c4')
const qrError = ref<string>('')

const isDeposit = ref<boolean>(true)

// async function sendEth(): Promise<void> {
//     try {
//         // 4. Get the current nonce for the wallet
//         const nonce = await wallet.getTransactionCount("pending");

//         // 5. Convert ETH amount to wei
//         const amount = ethers.utils.parseEther(amountInEther);

//         // 6. Estimate gas (optional, for better control)
//         const gasPrice = await provider.getGasPrice();
//         const gasLimit = 21000; // Standard gas limit for ETH transfer

//         // 7. Create the transaction object
//         const tx = {
//             to: recipientAddress,
//             value: amount,
//             gasPrice: gasPrice,
//             gasLimit: gasLimit,
//             nonce: nonce,
//         };

//         // 8. Sign and send the transaction
//         const transaction = await wallet.sendTransaction(tx);
//         console.log("Transaction hash:", transaction.hash);

//         // 9. Wait for the transaction to be mined
//         const receipt = await transaction.wait();
//         console.log("Transaction confirmed in block:", receipt.blockNumber);
//     } catch (error) {
//         console.error("Error sending ETH:", error);
//     }
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