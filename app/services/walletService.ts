import { ethers, HDNodeWallet } from 'ethers'
import type { TxBody, WalletMode, EthAddress } from '~/types';

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

export async function createWallet(wordCount: WalletMode): Promise<{
	address: string;
	mnemonic: string;
	wordCount: number;
	balance: string;
}> {
	try {
		// Map word count to entropy size (in bits)
		const entropyBits: Record<number, number> = {
			12: 128,
			15: 160,
			18: 192,
			21: 224,
			24: 256,
		}

		const bits = entropyBits[wordCount];
		if (!bits) {
			throw new Error("Invalid word count")
		}

		const entropyBytes = bits / 8;
		const entropy = ethers.randomBytes(entropyBytes);
		const mnemonic = ethers.Mnemonic.fromEntropy(entropy);
		const wallet = ethers.Wallet.fromPhrase(mnemonic.phrase);
		// const wallet = useState('wallet', () => ethers.Wallet.fromPhrase(mnemonic.phrase));

		let balance: string = await fetchBalance(wallet.address)

		return {
			address: wallet.address,
			mnemonic: mnemonic.phrase,
			wordCount: mnemonic.phrase.split(" ").length,
			balance: balance
		};
	} catch (error) {
		// errorMessage.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
		return {
			address: "",
			mnemonic: "",
			wordCount: 0,
			balance: ""
		};
	}
}

interface BalanceResponse {
	balance: string
}
export async function fetchBalance(address: string): Promise<string> {
	const response = await $fetch<BalanceResponse>('/api/getBalance', {
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

