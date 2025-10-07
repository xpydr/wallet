import { ref, type Ref } from 'vue';
import {
  sendTxApi,
  createWallet
} from '@/services/walletService';
import type { TxBody, WalletMode } from '~/types';

const wallet = ref<Awaited<ReturnType<typeof createWallet>> | null>(null);

export function useCreate(walletMode: WalletMode) {

  async function generate() {
    wallet.value = await createWallet(walletMode);
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