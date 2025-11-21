
export type WalletMode = 12 | 15 | 18 | 21 | 24;

export type Wallet = {
  address: string;
  balance: number;
  mnemonic: string
} | null;

export type TxBody = {
  to: string;
  value: bigint; // ether amount
  nonce: bigint;
  gasLimit: bigint;
  gasPrice: bigint;
  chainId: bigint;
  data: string;
  type: number;
}
