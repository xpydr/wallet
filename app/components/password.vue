<template>
    <div class="flex flex-col gap-4 justify-center items-center dark:bg-black dark:text-white transition">
        <div>
            <p>Please enter your password</p>
        </div>
        <div class="flex flex-col">
            <label><input v-model="password" placeholder="password" type="password" class="dark:bg-black transition" /></label>
            <button @click="submit" name="Submit" value="submit" class="my-2 border transition">enter</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWalletStore } from '~/stores/wallet';
const walletStore = useWalletStore();

import { ref } from 'vue';
const password = ref<string>('');

async function submit(): Promise<void> {
    await walletStore.initUser(password.value);
}
</script>