
import { useState } from "react";
import { Icon } from '@iconify/react';
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { getBalance } from "@/services/walletService";
import toast from "react-hot-toast";
import QrCode from "@/components/wallet/ui/QrCode";

import type { Wallet, WalletMode } from "@/types";

function WalletApp() {
  const { wallet, setWallet } = useWallet();
  const { generateWallet, sendTransaction } = useAuth();

  const [txHash, setTxHash] = useState('');
  const hideMnemonic = (): void => {
    setIsHideMnemonic(!isHideMnemonic);
  }

  const refreshBalance = async (): Promise<void> => {
    try {
      if (wallet?.address) {
        const res: string = await getBalance(wallet.address);

        const updatedWallet: Wallet = {
          address: wallet.address,
          balance: parseFloat(res),
          mnemonic: wallet.mnemonic
        }
        setWallet(updatedWallet);
        toast.success("Balance refreshed")
      }
    } catch (err) {
      setError("Failed to fetch balance. Please try again later.");
      console.error(err);
    }
  }
  const handleSend = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const res: string = await sendTransaction(addressInput, `${amountInput}`);
      setTxHash(res);
      console.log(res);
    } catch (err) {
      setError("Failed to send transaction. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  const handleGenerate = async (): Promise<void> => {
    try {
      setIsLoading(true);
      generateWallet(walletMode);
      setWallet(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const walletModes: number[] = [12, 15, 18, 21, 24];

  const [isDeposit, setIsDeposit] = useState(true); {/* show deposit/withdrawal ui */ }
  const [isHideMnemonic, setIsHideMnemonic] = useState(true); {/* show/hide mnemonic */ }
  const [isLock, setIsLock] = useState(false); {/* lock/unlock generate new wallet */ }
  const [isLoading, setIsLoading] = useState(false);

  const [addressInput, setAddressInput] = useState('');
  const [walletMode, setWalletMode] = useState<WalletMode>(12);

  const [amountInput, setAmountInput] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);

  return (
    <div className="flex flex-col justify-center"> 
      <div className="flex border-b m-2">
        <div className="flex flex-1 gap-4">
          <ul className="flex gap-4"> {/* select mnemonic word count */}
            {walletModes.map((value, i) => (
              <li key={i}>
                <label>
                  <input type="radio" name="wordCount" className="mx-2" value={value}
                    checked={value === walletMode} onChange={(e) => setWalletMode(parseInt(e.target.value) as WalletMode)} />
                  {value}-word
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-4 hover:cursor-pointer" onClick={() => setIsLock(!isLock)}>
          {isLock ?
            <Icon icon="zondicons:lock-closed" className="flex" width="24" height="24" /> :
            <Icon icon="bxs:lock-open" className="flex" width="24" height="24" />
          }
        </div>
        <div className="text-cyan-300">
          {isLock ?
            <button className="border p-2 overflow-hidden min-w-fit border-cyan-300 hover:cursor-not-allowed bg-cyan-900">Generate</button> :
            <button className="border p-2 overflow-hidden min-w-fit border-cyan-300 hover:cursor-pointer" onClick={handleGenerate}>Generate</button>
          }
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {error ? <p className="text-red-500">Error: {error}</p> : null}
        {wallet &&
          <div className="mx-2">
            <div className="flex items-center gap-2">
              <p>Address: {wallet?.address}</p>
              <a href="`https://sepolia.etherscan.io/address/${wallet.address}`" target="_blank" rel="noopener noreferrer">
                <Icon className="text-cyan-300 hover:cursor-pointer" icon="gridicons:external" width="24" height="24" />
              </a>
            </div>
            <br />
            <div className="flex items-center gap-2">
              <p>Network:</p>
              <select name="networkSelect" id="networkSelect" className="hover:cursor-pointer" defaultValue="sepolia">
                <option value="sepolia">Sepolia</option>
              </select>
            </div>
            <br />
            <div className="flex items-center gap-2">
              <p>Balance: {wallet?.balance} ETH</p>
              <Icon onClick={() => refreshBalance()} icon="material-symbols:refresh-rounded" width="24" height="24"
                className="text-cyan-300 hover:cursor-pointer" />
            </div>
            <br />
            <div className="flex items-center gap-2">
              <p>Seed: {!isHideMnemonic && <>{wallet?.mnemonic}</>}</p>
              {isHideMnemonic ?
                <Icon icon="bx:hide" className="text-cyan-300 hover:cursor-pointer" width="24" height="24" onClick={hideMnemonic} /> :
                <Icon icon="bx:show" className="text-cyan-300 hover:cursor-pointer" width="24" height="24" onClick={hideMnemonic} />
              }
            </div>
            <br />
          </div>
        }
        {wallet &&
          <div className="mx-2">
            <div className="grid grid-cols-2 w-full items-center justify-center">
              <div className="flex flex-col items-center gap-4 mb-8">
                <button className="border p-4 w-48 hover:cursor-pointer" onClick={() => setIsDeposit(true)}>Deposit</button>
                <button className="border p-4 w-48 hover:cursor-pointer" onClick={() => setIsDeposit(false)}>Withdraw</button>
              </div>
              <div>
                {isDeposit &&
                  <div className="flex justify-center">
                    <div className="dark:border-cyan-300">
                      <QrCode ethHex={wallet?.address} />
                    </div>
                  </div>
                }
                {(!isDeposit && !isLoading) &&
                  <div className="flex gap-2 flex-col text-left m-4">
                    <label className="flex gap-2">To:
                      <input placeholder="0x..." className="w-full" onChange={(e) => setAddressInput(e.target.value)} />
                    </label>
                    <label className="flex gap-2">Amount:
                      <input type="number" placeholder="ETH" className="w-full" onChange={(e) => setAmountInput(parseFloat(e.target.value))} />
                    </label>
                    <button className="border p-2 btn-submit" onClick={handleSend}>Send</button>
                  </div>
                }
              </div>
            </div>
            {(txHash && !isDeposit) &&
              <a href="`https://sepolia.etherscan.io/tx/${txHash}`" target="_blank" rel="noopener noreferrer" className="flex gap-2 hover:text-cyan-300 transition">
                Tx: {txHash}
              </a>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default WalletApp;