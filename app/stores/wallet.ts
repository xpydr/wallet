import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ethers } from 'ethers';
import { fetchBalance, sendTxApi } from '~/services/walletService';
import type { WalletMode } from '~/types';

interface WalletState {
    isAuth: Ref<boolean>;
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
    sendTx(to: string, value: string): Promise<any>;
    clearSession(): void;
}

export const useWalletStore = defineStore<
    'walletStore', WalletState, {
        getBalance():
            string
    },
    WalletActions
>('walletStore', {
    state: (): WalletState => ({
        isAuth: ref(false),
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
                    const res = await this.createWallet(12, password);
                    (res.success == false) ? this.isAuth = false : this.isAuth = true;
                    return { success: res.success }
                } else {
                    const res = await this.recoverWallet(password);
                    (res.success == false) ? this.isAuth = false : this.isAuth = true;
                    return { success: res.success }
                }
            } catch (err: any) {
                console.error(err.message);
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
                return { success: false };
            }
        },
        async recoverWallet(password: string): Promise<{ success: boolean }> {
            try {
                const jsonKeystore = localStorage.getItem('walletKeystore');
                if (!jsonKeystore) throw new Error('No keystore found');

                const wallet = await ethers.Wallet.fromEncryptedJson(jsonKeystore, password);

                this.keystore = jsonKeystore;
                this.address = wallet.address;
                this.mnemonic = wallet.mnemonic!.phrase;
                this.balance = await fetchBalance(wallet.address);

                return { success: true };
            } catch (error) {
                return { success: false };
            }
        },
        async getBalance(address?: string): Promise<{ balance: string }> {
            try {
                address ? null : address = this.address;
                const bal: string = await fetchBalance(address);
                this.balance = bal;
                console.log(bal);
                return { balance: bal };
            } catch (err: any) {
                return { balance: 'error' };
            }
        },
        async sendTx(to: string, value: string): Promise<any> {
            try {
                if (!this.keystore || typeof this.password !== 'string') throw new Error('Failed to authenticate');

                const txRequest: ethers.TransactionRequest = {
                    to: to,
                    value: ethers.parseEther(value)
                };

                const wallet: ethers.Wallet | ethers.HDNodeWallet = await ethers.Wallet.fromEncryptedJson(this.keystore, this.password);

                const config = useRuntimeConfig();
                const provider = new ethers.JsonRpcProvider(config.public.rpcUrl);
                const signer = wallet.connect(provider);

                const txPopulated: ethers.TransactionRequest = await signer.populateTransaction(txRequest);
                const txSigned: string = await wallet.signTransaction(txPopulated);
                const res = await sendTxApi({ txSigned: txSigned });
                if (res) return { hash: res.hash };
                else throw new Error('Failed to broadcast transaction');
            } catch (err: any) {
                throw createError({ statusCode: 500, statusMessage: err.message });
            }
        },
        clearSession() {
            localStorage.removeItem('walletKeystore');
            this.password = '';
            this.keystore = null;
            this.isAuth = false;
        },
    },
});