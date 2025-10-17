// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    nitro: {
        preset: 'node-server'
    },
    modules: ['@nuxt/icon', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/color-mode'],
    runtimeConfig: {
        public: {
            rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
        },
    },
});
