
import { ethers } from "ethers";
import { broadcastTx, getTxData } from "@/services/walletService";
import type { TransactionRequest } from "ethers";

export default async function sendTx(to: string, value: string, mnemonic: string): Promise<string> {
  try {
    const myWallet: ethers.HDNodeWallet = ethers.Wallet.fromPhrase(mnemonic);

    const txData = await getTxData(myWallet.address);
    if (!txData.nonce || !txData.feeData) throw new Error("Error fetching fee data");

    const nonce = txData.nonce;
    const maxFeePerGas = txData.feeData.maxFeePerGas;
    const maxPriorityFeePerGas = txData.feeData.maxPriorityFeePerGas;

    const tx: TransactionRequest = {
      to: to,
      value: ethers.parseEther(value),
      nonce: nonce, 
      gasLimit: 50000,
      chainId: 11155111n, // Sepolia testnet
      data: "0x",
      type: 2, // EIP-1559
      maxPriorityFeePerGas: ethers.parseUnits(maxPriorityFeePerGas, "gwei"), 
      maxFeePerGas: ethers.parseUnits(maxFeePerGas, "gwei"),
    };

    const txSigned = await myWallet.signTransaction(tx);
    const res = await broadcastTx(txSigned);
    console.log(res);
    return res;

  } catch (err) {
    throw new Error(`Error sending transaction: ${err}`);
  }
}
