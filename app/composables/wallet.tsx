import { ref, type Ref } from 'vue';
import {
  sendTxApi,
  createWallet
} from '@/services/walletService';
import type { TxBody, WalletMode } from '~/types';

const wallet = ref<Awaited<ReturnType<typeof createWallet>> | null>(null);

export async function useCreate(walletMode: WalletMode) {
  async function generate() {
    wallet.value = await createWallet(walletMode);
  }
  return { wallet, generate };
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
      console.error(err)
    }
  }
  return { txHash, sendTx };
}