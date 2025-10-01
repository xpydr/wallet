<template>
    <div class="flex flex-col justify-center items-center gap-16">
        <div>
            <button @click="isDeposit = true" class="border p-4">Deposit</button>
            <button @click="isDeposit = false" class="border p-4">Withdraw</button>

        </div>
        <div v-if="isDeposit">
            <qrcode-vue :value="hexInput" :size="200" level="H" render-as="svg" />
        </div>
    </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

// This will be a prop
const hexInput = ref<string>('0x294897f04cfA7de68aE6c76553CE4Cb520261624')
const qrError = ref<string>('')

const isDeposit = ref<boolean>(true)

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

button:hover {
    background-color: #f0f0f0;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>