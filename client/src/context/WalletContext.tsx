
import { createContext, useContext, useState } from "react";
import { type Wallet } from "@/types";

interface WalletContextValue {
  wallet: Wallet;
  setWallet: (wallet: Wallet) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
}
