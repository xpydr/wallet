#!/usr/bin/env node
import { ethers } from "ethers";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

(async () => {
    let m = await ask("Mnemonic (leave empty to generate): ");
    let w = m.trim() ? ethers.Wallet.fromMnemonic(m) : ethers.Wallet.createRandom();
    if (!m.trim()) console.log("Generated mnemonic:", w.mnemonic.phrase);
    console.log("Address:", w.address);

    // ← Here’s the change: Alchemy RPC URL
    const provider = new ethers.JsonRpcProvider(
        "https://eth-mainnet.alchemyapi.io/v2/" + process.env.API_KEY
    );
    const s = w.connect(provider);

    console.log("Balance:", ethers.formatEther(await provider.getBalance(w.address)), "ETH");

    let to = await ask("Recipient: "), amt = await ask("Amount (ETH): ");
    console.log("\n⏳ Sending transaction...");
    let tx = await s.sendTransaction({ to: to.trim(), value: ethers.parseEther(amt) });
    console.log("Tx hash:", tx.hash);
    await tx.wait();
    console.log("✅ Transaction confirmed");

    rl.close();
})();
