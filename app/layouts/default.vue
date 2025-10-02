<template>
    <div class="m-4 p-16 min-w-fit h-screen font-mono">
        <nav class="flex flex-col">
            <div class="text-right top-0">
                <Icon name="line-md:moon-filled-loop" size="24" />
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