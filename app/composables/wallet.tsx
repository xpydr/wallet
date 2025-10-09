import { ref } from 'vue';
import {
  sendTxApi,
  createWallet,
  fetchBalance
} from '@/services/walletService';
import type { EthAddress, TxBody, WalletMode } from '~/types';

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

export function useFetchBalance() {
  const balance = ref<string>('');
  async function fetch(address: EthAddress) {
    try {
      balance.value = await fetchBalance(address); 
    } catch (err: any) {

    }
  }
  return { balance, fetch }
}
