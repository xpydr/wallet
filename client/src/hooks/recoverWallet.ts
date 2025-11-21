
import { ethers } from "ethers";
import { type Wallet } from "@/types";
import { getBalance } from "@/services/walletService";

export async function recoverWallet(password: string): Promise<Wallet> {
  try {
    const jsonKeystore = localStorage.getItem('walletKeystore');
    if (!jsonKeystore) throw new Error('No keystore found');

    const wallet = await ethers.Wallet.fromEncryptedJson(jsonKeystore, password);

    const myBalance = parseFloat(await getBalance(wallet.address));
    
    // Wallet can be either Wallet or HDNodeWallet; only HDNodeWallet has mnemonic, which is always the expected type here
    const myMnemonic = "mnemonic" in wallet && wallet.mnemonic ? wallet.mnemonic.phrase : "";

    const myWallet: Wallet = {
      address: wallet.address,
      balance: myBalance,
      mnemonic: myMnemonic
    }
    return myWallet;
  } catch {
    return null;
  }
}
