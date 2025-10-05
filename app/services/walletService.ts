import { ethers, HDNodeWallet } from 'ethers'
import type { WalletMode } from '~/types';

interface BalanceResponse {
	balance: string
}

let signer: ethers.Signer | null = null;
let provider: ethers.JsonRpcProvider | null = null;
const apiKey = process.env.API_KEY // Private, server-only

export async function sendTxApi(payload: any) {
	return await $fetch('/api/sendTx', {
		method: 'POST',
		body: payload
	});
}

export function initProvider(): void {
	provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`);
}

export async function createWallet(wordCount: WalletMode): Promise<{
	address: string;
	mnemonic: string;
	wordCount: number;
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
			throw new Error("Invalid word count. Choose 12, 15, 18, 21, or 24.")
		}

		// Convert bits to bytes 
		const entropyBytes = bits / 8;

		// Generate random entropy
		const entropy = ethers.randomBytes(entropyBytes);

		// Create mnemonic from entropy
		const mnemonic = ethers.Mnemonic.fromEntropy(entropy);

		// Create HD wallet from mnemonic 
		const wallet = ethers.Wallet.fromPhrase(mnemonic.phrase);

		console.log(wallet);

		const key = new ethers.SigningKey(wallet.privateKey);

		const address = wallet.address
		fetchBalance(wallet.address)

		return {
			address: wallet.address,
			mnemonic: mnemonic.phrase,
			wordCount: mnemonic.phrase.split(" ").length,
		};
	} catch (error) {
		// errorMessage.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
		return {
			address: "",
			mnemonic: "",
			wordCount: 0,
		};
	}
}

export function useWallet() {
	async function sendTx(to: string, value: string) {
		return await $fetch('/api/sendTx', {
			method: 'POST',
			body: { to, value }
		});
	}
	return { sendTx };
}

export async function fetchBalance(address: string): Promise<string> {
	// Fetch balance from server route
	const response = await $fetch<BalanceResponse>('/api/getBalance', {
		method: 'POST',
		body: { address: address },
	})
	return response.balance
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

interface TxParams {
	to: string;
	value?: string | number | bigint;
	data?: string;
	gasLimit?: bigint;
	gasPrice?: bigint;
}

export async function sendTransaction(params: TxParams): Promise<string> {
	if (!signer) throw new Error("No signer available");
	const tx: ethers.TransactionRequest = {
		to: params.to,
		value:
			params.value !== undefined
				? ethers.parseEther(params.value.toString())
				: undefined,
		data: params.data,
		gasLimit: params.gasLimit,
		gasPrice: params.gasPrice,
	};
	const res = await signer.sendTransaction(tx);
	return res.hash;
}

export async function getBalance(address: string): Promise<bigint> {
	if (!provider) throw new Error("Provider not initialized");
	return await provider.getBalance(address);
}
