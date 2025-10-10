import type { TxBody } from '~/types';

export async function sendTxApi(payload: TxBody) {
    try {
        return await $fetch<{ hash: string }>('/api/sendTx', {
            method: 'POST',
            body: payload
        });
    } catch (err) {
        console.error(err)
    }
}

export async function fetchBalance(address: string): Promise<string> {
    const response = await $fetch<{ balance: string }>('/api/getBalance', {
        method: 'POST',
        body: { address: address },
    });
    return response.balance;
}

// export async function loadWallet(
//   encryptedJson: string,
//   password: string
// ): Promise<string> {
//   if (!provider) throw new Error("Provider not initialized");
//   wallet.value = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
//   signer = wallet.connect(provider);
//   return wallet.address;
// }

// export async function exportWallet(password: string): Promise<string> {
//   if (!wallet) throw new Error("No wallet loaded");
//   return await wallet.encrypt(password);
// }

