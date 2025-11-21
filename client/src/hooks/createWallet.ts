
import { ethers } from "ethers";
import { type WalletMode, type Wallet } from "@/types";
import toast from "react-hot-toast";

export async function createWallet(wordCount: WalletMode = 12, password: string): Promise<Wallet> {
  try {
    const entropyBits = {
      12: 128,
      15: 160,
      18: 192,
      21: 224,
      24: 256
    } as const;

    const bits = entropyBits[wordCount];
    if (!bits) {
      throw new Error('Error parsing entropy bits');
    }

    const entropyBytes = bits / 8;
    const entropy = ethers.randomBytes(entropyBytes);
    const mnemonic = ethers.Mnemonic.fromEntropy(entropy);
    const wallet = ethers.Wallet.fromPhrase(mnemonic.phrase);

    const jsonKeystore = await wallet.encrypt(password);
    localStorage.setItem('walletKeystore', jsonKeystore);

    const newWallet: Wallet = {
      address: wallet.address,
      balance: 0, // init as 0 to save resources - odds of generating a used wallet are practically zero
      mnemonic: mnemonic.phrase
    }
    return newWallet;
  } catch (err) {
    toast.error("Failed to create wallet");
    console.error(err);
    return null;
  }
}
