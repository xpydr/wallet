import { ref } from 'vue';
import { sendTxApi, fetchBalance } from '~/services/walletService';
import { useWalletStore } from '~/stores/wallet';
import type { TxBody, WalletMode } from '~/types';

export async function useCreate(walletMode: WalletMode) {
    const walletStore = useWalletStore(); // rename to wallet after renaming other wallet
    return { 
        createWallet: async () => {
            await walletStore.createWallet(walletMode);
        },
        address: computed(() => walletStore.address),
        balance: computed(() => walletStore.balance),
        mnemonic: computed(() => walletStore.mnemonic)
    };
}

export function useWallet() {
    const txHash = ref<string | null>(null);

    async function sendTx(to: string, value: string) {
        try {
            const res = await sendTxApi({ to, value });
            if (res) {
                txHash.value = res.hash;
            }
        } catch (err: any) {
            console.error(err);
        }
    }
    return { txHash, sendTx };
}