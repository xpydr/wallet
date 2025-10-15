<template>
    <div class="flex items-center pb-2 dark:bg-black dark:text-white transition">
        <div class="flex flex-row flex-1 gap-4">
            <label v-for="mode in walletModes"> <!-- select mnemonic word count -->
                <input v-model="walletMode" type="radio" name="word-count" :value="mode" class="mx-2">{{ mode }}-word
            </label>
        </div>
        <div class="mx-4 hover:cursor-pointer" @click="isLock = !isLock">
            <Icon v-if="isLock" name="zondicons:lock-closed" size="24" />
            <Icon v-else name="bxs:lock-open" size="24" />
        </div>
        <button v-if="!isLock" class="border border-black p-2 overflow-hidden min-w-fit border-cyan-300 text-cyan-300"
            @click="generateWallet">
            Generate
        </button>
        <div v-else title="Locked"
            class="border border-black p-2 overflow-hidden min-w-fit border-cyan-300 text-cyan-300 hover:cursor-not-allowed bg-cyan-900">
            Generate
        </div>
    </div>
    <div class="flex flex-col gap-4">
        <hr>
        <p v-if="error" class="text-red-500">{{ error }}</p>
        <div v-if="walletStore.address" class="mx-2">
            <div class="flex items-center gap-2">
                <p>Address: {{ address }}</p>
                <a :href="`https://sepolia.etherscan.io/address/${address}`" target="_blank" rel="noopener noreferrer">
                    <Icon class="text-cyan-300 hover:cursor-pointer" name="gridicons:external" size="24" />
                </a>
            </div>
            <br>
            <div class="flex items-center gap-2">
                <p>Network:</p>
                <select name="networkSelect" id="networkSelect" class="dark:bg-black dark:text-white hover:cursor-pointer transition">
                    <option value="sepolia" selected>Sepolia</option>
                </select>
            </div>
            <br>
            <div class="flex items-center gap-2">
                <p>Balance: {{ walletStore.balance }} ETH</p>
                <Icon @click="refreshBalance" class="text-cyan-300 hover:cursor-pointer"
                    name="material-symbols:refresh-rounded" size="24" />
            </div>
            <br>
            <div class="flex items-center gap-2">
                <p>Seed: <span v-show="!isHideMnemonic">{{ mnemonic }}</span></p>
                <Icon v-if="isHideMnemonic" @click="isHideMnemonic = !isHideMnemonic"
                    class="text-cyan-300 hover:cursor-pointer" name="bx:hide" size="24" />
                <Icon v-else @click="isHideMnemonic = !isHideMnemonic" class="text-cyan-300 hover:cursor-pointer"
                    name="bx:show" size="24" />
            </div>
            <br>
        </div>
        <div v-if="walletStore.address" class="mx-2">
            <div class="grid grid-cols-2 w-full items-center justify-center text-center">
                <div class="flex flex-col items-center gap-4 mb-8">
                    <button @click="isDeposit = true" class="border p-4 w-48" active-class="bg-black"
                        :class="[isDeposit ? 'border-cyan-300' : '']">Deposit</button>
                    <button @click="isDeposit = false" class="border p-4 w-48"
                        :class="[!isDeposit ? 'border-cyan-300' : '']">Withdraw</button>
                </div>
                <div>
                    <div v-show="isDeposit" class="flex justify-center">
                        <div class="dark:border-cyan-300 transition">
                            <qrcode-vue :value="address" :size="qrSize" foreground="black" :background="qrBg" level="H"
                            render-as="svg" />
                        </div>
                        
                    </div>
                    <div v-show="!isDeposit && !isLoading" class="flex gap-2 flex-col text-left m-4">
                        <label class="flex gap-2">To: <input v-model="to" placeholder="0x..." class="w-full" /></label>
                        <label class="flex gap-2">Amount: <input v-model="amountInEther" placeholder="ETH"
                                class="w-full" /></label>
                        <button @click="handleSend" class="border p-2">Send</button>
                    </div>
                </div>
                <p v-if="txHash && !isDeposit" class="flex gap-2">
                    Tx: <a v-if="txHash && !isDeposit" :href="`https://sepolia.etherscan.io/tx/${txHash}`"
                        target="_blank" rel="noopener noreferrer">{{ txHash }}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { WalletMode } from '~/types';
import { useWalletStore } from '~/stores/wallet';
import QrcodeVue from 'qrcode.vue';

const qrSize = ref<number>(200);
const qrBg = ref<string>('cyan');

const walletStore = useWalletStore();
const walletModes = [12, 15, 18, 21, 24] // select word count
const walletMode = ref<WalletMode>(12); // default 12

const error = ref<any>(null);
const { txHash, sendTx } = useWallet();
const to = ref<string>('');
const amountInEther = ref<string>('');

const isDeposit = ref<boolean>(true); // shows deposit qr OR withdrawal ui
const isLoading = ref<boolean>(false); // hides withdrawal ui during tx
const isLock = ref<boolean>(false); // disables generate button
const isHideMnemonic = ref<boolean>(true); 

const { createWallet, address, mnemonic } = await useCreate();

async function generateWallet(): Promise<void> {
    isLoading.value = true;
    try {
        await createWallet(walletMode.value)
    } catch (err: any) {
        error.value = err.message;
    } finally {
        isLoading.value = false;
    }
}

async function handleSend(): Promise<void> {
    isLoading.value = true;
    try {
        if (!to.value || !amountInEther.value) {
            throw new Error('Missing fields');
        }
        const res = sendTx(to.value, amountInEther.value);
        console.log(res);
    } catch (err: any) {
        error.value = err.message;
    } finally {
        isLoading.value = false
    }
}

async function refreshBalance(): Promise<void> { // eth balance: manual refresh & update ui
    isLoading.value = true;
    try {
        if (!walletStore) {
            throw new Error('Wallet is not initialized');
        }
        await walletStore.getBalance(address.value);
    } catch (err: any) {
        console.error('Failed to fetch balance:', err.message);
    } finally {
        isLoading.value = false;
    }
}

watch(to, (newValue) => { // recipient input validation
    if (newValue && !/^0x([a-fA-F0-9]{2})+$/.test(newValue)) {
        error.value = 'Please enter a valid hexadecimal string'
    } else {
        error.value = ''
    }
});
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