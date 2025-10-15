export type WalletMode = 12 | 15 | 18 | 21 | 24;

export type TxBody = {
    to: string;
    value: string;    // ether amount as string
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
}