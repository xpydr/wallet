export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    address: ''
    mnemonic: ''
    balance: ''
  }),
  actions: {
    async fetch () {
      const infos = await $fetch('https://api.nuxt.com/modules/pinia')

      this.name = infos.name
      this.description = infos.description
    },
  },
});