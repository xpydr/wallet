import { ref } from 'vue';
import { useWalletStore } from '~/stores/wallet';
import type { WalletMode } from '~/types';

export async function useCreate() {
    const wallet = useWalletStore();
    return {
        createWallet: async (walletMode: WalletMode) => {
            await wallet.createWallet(walletMode, '');
        },
        address: computed(() => wallet.address),
        mnemonic: computed(() => wallet.mnemonic)
    };
}

export function useWallet() {
    const txHash = ref<string | null>(null);
    const wallet = useWalletStore();

    async function sendTx(to: string, value: string) {
        try {
            const res = await wallet.sendTx(to, value);
            if (res) {
                txHash.value = res.hash;
            }
        } catch (err: any) {
            console.error(err);
        }
    }
    return { txHash, sendTx };
}