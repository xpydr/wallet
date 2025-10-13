import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ethers } from 'ethers';
import { fetchBalance } from '~/services/walletService';
import type { WalletMode } from '~/types';

interface WalletState {
    address: Ref<string>;
    mnemonic: Ref<string>;
    balance: Ref<string>;
    keystore: Ref<string | null>;
    password: Ref<string | null>;
}
interface WalletActions {
    createWallet(wordCount: WalletMode, password: string): Promise<{ success: boolean }>;
    recoverWallet(password: string): Promise<{ success: boolean }>;
    getBalance(address: string): Promise<{ balance: string }>;
    initUser(password: string): Promise<{ success: boolean }>;
    clearPassword(): void;
}

export const useWalletStore = defineStore<
    'walletStore', WalletState, {
        getBalance():
            string
    },
    WalletActions
>('walletStore', {
    state: (): WalletState => ({
        address: ref(''),
        mnemonic: ref(''),
        balance: ref(''),
        keystore: ref(''),
        password: ref(''),
    }),
    actions: {
        async initUser(password: string): Promise<{ success: boolean }> {
            try {
                this.password = password
                this.keystore = localStorage.getItem('walletKeystore') || null
                if (!this.keystore) {
                    await this.createWallet(12, password)
                } else {
                    await this.recoverWallet(password)
                }
                return { success: true }
            } catch (err: any) {
                console.error(err)
            }
            return { success: false };
        },

        async createWallet(wordCount: WalletMode, password: string): Promise<{ success: boolean }> {
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

                const jsonKeystore = await wallet.encrypt(password);
                this.keystore = jsonKeystore;
                localStorage.setItem('walletKeystore', jsonKeystore);

                return { success: true };
            } catch (error) {
                console.error('Error creating wallet:', error);
                return { success: false };
            }
        },
        async recoverWallet(password: string): Promise<{ success: boolean }> {
            try {
                const jsonKeystore = this.keystore || localStorage.getItem('walletKeystore');
                if (!jsonKeystore) throw new Error('No keystore found');

                const wallet = await ethers.Wallet.fromEncryptedJson(jsonKeystore, password);

                this.address = wallet.address;
                this.mnemonic = wallet.mnemonic!.phrase;
                this.balance = await fetchBalance(wallet.address);

                return { success: true };
            } catch (error) {
                console.error('Error recovering wallet:', error);
                return { success: false };
            }
        },
        async getBalance(address?: string): Promise<{ balance: string }> {
            try {
                address ? null : address = this.address;
                const bal: string = await fetchBalance(address);
                if (!address) this.balance = bal;
                return { balance: bal };
            } catch (err: any) {
                console.error(err);
                return { balance: 'error' };
            }
        },
        clearPassword() {
            this.password = '';
        },
    },
});