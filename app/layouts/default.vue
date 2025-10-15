<template>
    <div class="p-16 min-w-fit h-screen font-mono dark:bg-black dark:text-white transition">
        <nav class="flex flex-col">
            <div class="text-right top-0">
                <Icon v-if="colorMode.value === 'dark'" @click="colorMode.value === 'dark' ? colorMode.value = 'light' : colorMode.value = 'dark'"
                name="line-md:sunny-filled-loop-to-moon-filled-loop-transition" size="24" class="hover:cursor-pointer" />
                <Icon v-else @click="colorMode.value === 'dark' ? colorMode.value = 'light' : colorMode.value = 'dark'"
                name="line-md:moon-filled-to-sunny-filled-loop-transition" size="24" class="hover:cursor-pointer" />
            </div>
            <div class="text-center">
                <Icon class="text-cyan-300" name="la:spider" size="36" />
            </div>
        </nav>
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>