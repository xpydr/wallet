
import { createContext, useContext, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { createWallet } from "@/hooks/createWallet";
import { recoverWallet } from "@/hooks/recoverWallet";
import type { Wallet, WalletMode } from "@/types";
import sendTx from "@/hooks/sendTx";

interface AuthContextValue {
  isAuth: boolean;
  password: string;
  login: (password: string) => Promise<void>;
  logout: () => void;
  generateWallet: (wordCount: WalletMode) => void;
  sendTransaction: (to: string, value: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { wallet, setWallet } = useWallet();
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');

  const login = async (password: string) => { // unlock keystore or create new wallet
    setPassword(password);

    const jsonKeystore: string | null = localStorage.getItem('walletKeystore');
    const res: Wallet = !jsonKeystore ? await createWallet(12, password) : await recoverWallet(password);

    setIsAuth(!!res);
    setWallet(res);
  }

  const logout = () => {
    localStorage.removeItem('walletKeystore');
    setIsAuth(false);
  }

  const generateWallet = async (wordCount: WalletMode) => {
    const res = await createWallet(wordCount, password);
    setWallet(res);
  }

  const sendTransaction = async (to: string, value: string) => {
    if (!wallet) throw new Error('Failed to send transaction, no wallet found. Please try again later.');
    const res = await sendTx(to, value, wallet.mnemonic);
    return res; // transaction hash
  }

  return (
    <AuthContext.Provider value={{ isAuth, password, login, logout, generateWallet, sendTransaction }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
