
import AuthKeystore from "../components/wallet/AuthKeystore";
import WalletApp from "../components/wallet/WalletApp";

function Wallet() {
  const isLoggedIn: boolean = true;
  return(
    <div className="flex justify-center items-center pb-2 dark:bg-black dark:text-white transition">
      <div className="border text-sm p-4">
        {isLoggedIn ? <WalletApp /> : <AuthKeystore />}
      </div>
    </div>
  );
}

export default Wallet;
