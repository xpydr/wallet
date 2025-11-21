
import '@/App.css';
import Wallet from '@/pages/Wallet';
import { AppProviders } from '@/context/AppProviders';
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <Toaster />
      <div className='font-mono min-h-screen bg-black flex justify-center items-center'>
        <AppProviders>
          <Wallet />
        </AppProviders>
      </div>
    </>
  )
}

export default App;
