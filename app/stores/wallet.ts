import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ethers } from 'ethers';
import { fetchBalance } from '~/services/walletService';
import type { WalletMode } from '~/types';

export const useWalletStore = defineStore('walletStore', {
    state: () => ({
        address: ref<string>(''),
        mnemonic: ref<string>(''),
        balance: ref<string>(''),
    }),
    actions: {
        async createWallet(wordCount: WalletMode): Promise<{ success: boolean }> {
            try {
                const entropyBits: Record<number, number> = {
                    12: 128,
                    15: 160,
                    18: 192,
                    21: 224,
                    24: 256,
                };

                const bits = entropyBits[wordCount];
                if (!bits) {
                    throw new Error('Invalid word count');
                }

                const entropyBytes = bits / 8;
                const entropy = ethers.randomBytes(entropyBytes);
                const mnemonic = ethers.Mnemonic.fromEntropy(entropy);
                const wallet = ethers.Wallet.fromPhrase(mnemonic.phrase);

                this.address = wallet.address;
                this.mnemonic = mnemonic.phrase;
                this.balance = await fetchBalance(wallet.address);

                return { success: true };
            } catch (error) {
                console.error('Error creating wallet:', error);
                return { success: false };
            }
        },
        async getBalance(address: string): Promise<{ success: boolean }> {
            try {
                this.balance = await fetchBalance(address);
                return { success: true }
            } catch (err: any) {
                console.error(err);
                return { success: false }
            }
        }
    },
});