
import { useState } from "react";
import { Icon } from '@iconify/react';

function WalletApp() {

  const hideMnemonic = (): void => {
    setIsHideMnemonic(!isHideMnemonic);
  }
  const refreshBalance = (): void => {
    console.log('refresh');
  }
  const handleSend = async (): Promise<void> => {
    console.log('send');
  }
  
  const walletModes: number[] = [12, 15, 18, 21, 24];

  const [isDeposit, setIsDeposit] = useState(true); {/* show deposit/withdrawal ui */ }
  const [isHideMnemonic, setIsHideMnemonic] = useState(true); {/* show/hide mnemonic */}
  const [isLock, setIsLock] = useState(false); {/* lock/unlock generate new wallet */}
  const [isLoading, setIsLoading] = useState(false); 

  const [addressInput, setAddressInput] = useState('');
  const [walletMode, setWalletMode] = useState(12);

  const [amountInput, setAmountInput] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [recipient, setRecipient] = useState({
    address: '',
    amount: 0
    });
  const [wallet, setWallet] = useState({
    address: '',
    balance: 0,
    mnemonic: ''
  });

  return (
    <div className="flex items-center"> {/* select mnemonic word count */}
      <div className="flex flex-1 gap-4">
        <ul className="flex gap-4">
          {walletModes.map((value, i) => (
            <li key={i}>
              <label>
                <input type="radio" name="wordCount" className="mx-2" value={value}
                  checked={value === walletMode} onChange={(e) => setWalletMode(parseInt(e.target.value))} />
                {value}-word
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-4 hover:cursor-pointer flex justify-between" onClick={() => setIsLock(!isLock)}>
        {isLock ?
          <Icon icon="zondicons:lock-closed" width="24" height="24" /> :
          <Icon icon="bxs:lock-open" width="24" height="24" />
        }
      </div>
      <div className="text-cyan-300">
        {isLock ?
          <button className="border p-2 overflow-hidden min-w-fit border-cyan-300 hover:cursor-not-allowed bg-cyan-900">Generate</button> :
          <button className="border p-2 overflow-hidden min-w-fit border-cyan-300">Generate</button>
        }
      </div>
      <div className="flex flex-col gap-4">
        <hr />
        {error ? <p className="text-red-500">Error: {error}</p> : null}
        {wallet.address ??
          <div className="mx-2">
            <div className="flex items-center gap-2">
              <p>Address: {wallet.address}</p>
              <a href="`https://sepolia.etherscan.io/address/${address}`" target="_blank" rel="noopener noreferrer">
                <Icon className="text-cyan-300 hover:cursor-pointer" icon="gradicons:external" width="24" height="24" />
              </a>
            </div>
            <br />
            <div className="flex items-center gap-2">
              <p>Network:</p>
              <select name="networkSelect" id="networkSelect" className="hover:cursor-pointer">
                <option value="sepolia" selected>Sepolia</option>
              </select>
            </div>
            <br />
            <div className="flex items-center gap-2">
              <p>Balance: {wallet.balance} ETH</p>
              <Icon onClick={() => refreshBalance()} icon="material-symbols:refresh-rounded" width="24" height="24"
                className="text-cyan-300 hover:cursor-pointer" />
            </div>
            <br />
            <div className="flex items-center gap-2">
              <p>Seed: {isHideMnemonic ?? <>{wallet.mnemonic}</>}</p>
              {isHideMnemonic ?
                <Icon icon="bx:hide" width="24" height="24" onClick={hideMnemonic} /> :
                <Icon icon="bx:show" width="24" height="24" onClick={hideMnemonic} />
              }
            </div>
            <br />
          </div>
        }
        {wallet.address ??
          <div className="mx-2">
            <div className="grid grid-cols-2 w-full items-center justify-center text-center">
              <div className="flex flex-col items-center gap-4 mb-8">
                <button className="border p-4 w-48">Deposit</button>
                <button className="border p-4 w-48">Withdraw</button>
              </div>
              <div>
                {isDeposit ??
                  <div className="flex justify-center">
                    <div className="dark:border-cyan-300">
                      {/* qr code */}
                    </div>
                  </div>
                }
                {(!isDeposit && !isLoading) ??
                  <div className="flex gap-2 flex-col text-left m-4">
                    <label className="flex gap-2">To: 
                      <input placeholder="0x..." className="w-full" onChange={(e) => setAddressInput(e.target.value)} />
                    </label>
                    <label className="flex gap-2">Amount: 
                      <input className="w-full" placeholder="ETH" />
                    </label>
                    <button className="border p-2" onClick={handleSend}>Send</button>
                  </div>
                }
                {(txHash && !isDeposit) ??
                  <p className="flex gap-2">
                    {(txHash && !isDeposit) ??
                      <a href="`https://sepolia.etherscan.io/tx/${txHash}`" target="_blank" rel="noopener noreferrer">
                        {txHash}
                      </a>
                    }
                  </p>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default WalletApp;