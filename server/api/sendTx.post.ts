import { ethers } from 'ethers';
import type { TxBody } from '~/types';

export default defineEventHandler(async (event) => {
    const apiKey = process.env.API_KEY
    const seed: string | undefined = process.env.SEED_PHRASE
    if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' });
    if (!seed) throw new Error('Missing SEED_PHRASE');

    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`);
    let wallet = ethers.Wallet.fromPhrase(seed).connect(provider);

    const body = await readBody<TxBody>(event);
    if (!body?.to || !body?.value) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
    }

    const tx: ethers.TransactionRequest = {
        to: body.to,
        value: body.value ? ethers.parseEther(body.value) : undefined,
        data: body.data ?? undefined,
        gasLimit: body.gasLimit ? BigInt(body.gasLimit) : undefined,
        gasPrice: body.gasPrice ? BigInt(body.gasPrice) : undefined,
    };

    try {
        const response = await wallet.sendTransaction(tx);
        return { hash: response.hash };
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});
