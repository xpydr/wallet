
import AuthKeystore from "@/components/wallet/AuthKeystore";
import WalletApp from "@/components/wallet/WalletApp";
import { useAuth } from "@/context/AuthContext";

function Wallet() {
  const { isAuth } = useAuth();

  return (
    <div className="flex justify-center items-center dark:bg-black dark:text-white transition">
      <div className="border max-w-5xl text-sm primary-container">
        {isAuth ? <WalletApp /> : <AuthKeystore />}
      </div>
    </div>
  );
}

export default Wallet;
