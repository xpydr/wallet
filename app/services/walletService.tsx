import { ethers } from "ethers";

let wallet: ethers.Wallet | null = null;
let signer: ethers.Signer | null = null;
let provider: ethers.JsonRpcProvider | null = null;

export function initProvider(rpcUrl: string): void {
  provider = new ethers.JsonRpcProvider(rpcUrl);
}

export function createWallet(): string {
  if (!provider) throw new Error("Provider not initialized");
  wallet = ethers.Wallet.createRandom();
  signer = wallet.connect(provider);
  return wallet.address;
}

export async function loadWallet(
  encryptedJson: string,
  password: string
): Promise<string> {
  if (!provider) throw new Error("Provider not initialized");
  wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  signer = wallet.connect(provider);
  return wallet.address;
}

export async function exportWallet(password: string): Promise<string> {
  if (!wallet) throw new Error("No wallet loaded");
  return await wallet.encrypt(password);
}

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
