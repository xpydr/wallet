
import { WalletProvider } from "@/context/WalletContext";
import { AuthProvider } from "@/context/AuthContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <WalletProvider>
    <AuthProvider>{children}</AuthProvider>
  </WalletProvider>
);
