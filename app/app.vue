<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>

<script setup lang="ts">
const walletStore = useWalletStore();
await walletStore.createWallet(12);
</script>