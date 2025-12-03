# Ethereum Wallet Application

A secure, full-stack Ethereum wallet built with modern web technologies, emphasizing client-side security best practices. Private keys and mnemonics never leave the browser — all transaction signing occurs locally using **ethers.js v6**.

## Features

- Generate new Ethereum wallets (mnemonic-based)
- Import existing wallets via mnemonic or encrypted JSON keystore
- Securely encrypt and store the `ethers.Wallet` JSON keystore using a user-defined password (PBKDF2 + AES)
- View real-time native ETH balance with manual refresh
- Send ETH transactions (signed entirely in the browser)
- Export mnemonic or encrypted keystore at any time
- Responsive UI built with React 18 + Tailwind CSS
- Lightweight Node.js + Express backend for serving the frontend and optional future extensions

**Security Highlights**
- Private keys are never transmitted or stored on the server
- All cryptographic operations (signing, encryption/decryption) are performed client-side
- Encrypted keystores are compatible with standard ethers.js `Wallet.fromEncryptedJson`

## Tech Stack

### Client
- React 18 (Vite recommended)
- ethers.js v6
- Tailwind CSS v4
- TypeScript

### Server
- Node.js
- Express.js
- ethers.js v6


## Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm

### Installation

# Clone the repository
git clone https://github.com/xpdyr/wallet.git
cd wallet

# Install dependencies for both client and server
cd client && pnpm install
cd ../server && pnpm install

### Development

# Terminal 1 - Frontend (Vite dev server)
cd client
npm run dev

# Terminal 2 - Backend (Express server)
cd server
npm start

### Security Model 
1. Wallet creation/import happens entirely in the browser.
2. The ethers.Wallet instance is encrypted client-side using wallet.encrypt(password) with scrypt and AES-128-CTR.
3. The encrypted JSON is stored in localStorage.
4. On unlock, the wallet is decrypted in memory only — never persisted in plain text.
5. Transaction signing uses the in-memory wallet instance.
6. No private key or mnemonic is ever sent to the backend.

### Environment Variables
## Client
VITE_API_URL = http://localhost:3000/api/v1 (Adjust port as needed)
## Server
API_KEY = (Free key available through Alchemy for RPC)
PORT = 3000 

### Contributing
Contributions are welcome. Please open an issue first to discuss major changes.
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and open a Pull Request

### License
This project is licensed under the MIT License – see the LICENSE file for details.