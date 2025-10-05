import { ref, type Ref } from 'vue';
import {
  sendTxApi,
  createWallet
} from '@/services/walletService';
import type { WalletMode } from '~/types';

export function useCreate(walletMode: Ref<WalletMode>) {
  const wallet = ref<Awaited<ReturnType<typeof createWallet>> | null>(null);

  async function generate() {
    wallet.value = await createWallet(walletMode.value);
  }
  return { wallet, generate };
}

export function useWallet() {
  const txHash = ref<string | null>(null);

  async function sendTx(to: string, value: string) {
    const res = await sendTxApi({ to, value });
    txHash.value = res.hash;
  }
  return { txHash, sendTx };
}
