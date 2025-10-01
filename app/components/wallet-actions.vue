<template>
    <div class="flex justify-around">
        <div>
            <button class="border p-4">Deposit</button>
        </div>
        <div>
            <button class="border p-4">Withdraw</button>
        </div>
    </div>
</template>

<script setup lang="ts">
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