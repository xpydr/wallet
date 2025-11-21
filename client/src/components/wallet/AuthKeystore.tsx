
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@iconify/react";

function AuthKeystore() {

  const { login, logout } = useAuth();
  const [password, setPassword] = useState('');

  const [isKeystoreExist, setIsKeystoreExist] = useState(!!localStorage.getItem("walletKeystore")); // Clear last session / Remove saved keystore from localStorage
  console.log(isKeystoreExist);

  return (
    <div className="flex flex-col gap-4 justify-center items-center dark:bg-black dark:text-white">
      {isKeystoreExist ?
        <>
          <Icon onClick={logout} icon="ic:baseline-power-settings-new" width="24" height="24" className="absolute top-2 right-2 hover:cursor-pointer hover:text-cyan-300 transition" />
          <p className="text-lg">Please enter your password</p>
        </> :
        <>
          <p className="text-lg">Please create your password</p>
        </>
      }
      <div className="flex flex-col gap-2">
        <label>
          <input placeholder="password" type="password" className="border rounded p-0.5" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button onClick={() => login(password)} className="my-2 border btn-submit">Enter</button>
      </div>
    </div>
  );
}

export default AuthKeystore;
