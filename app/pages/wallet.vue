<template>
    <div class="border text-sm p-4 dark:bg-black dark:text-white transition">
        <password v-if="!wallet.isAuth" />
        <new-wallet v-else /> 
    </div>
</template>

<script setup lang="ts">
import { useWalletStore } from '~/stores/wallet';
const wallet = useWalletStore();
</script>
