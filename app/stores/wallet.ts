import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import type { WalletMode } from '~/types';

export const useWalletStore = defineStore('walletStore', {
    state: () => ({
        address: '',
        mnemonic: '',
        balance: '',
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
    },
});

// Example fetchBalance (define or import this)
async function fetchBalance(address: string): Promise<string> {
    // Implement balance fetching logic (e.g., via provider)
    return '0';
}