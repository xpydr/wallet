import { ethers } from 'ethers';
import { defineEventHandler, readBody } from 'h3';
import type { TxBody } from '~/types';

export default defineEventHandler(async (event) => {
  const apiKey = process.env.API_KEY
  const seed = process.env.SEED_PHRASE
  if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' });

  const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`);
  const wallet = ethers.Wallet.fromPhrase(seed ?? '').connect(provider);


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
