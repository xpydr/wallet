import { ethers } from 'ethers';
import type { TxBody } from '~/types';

export default defineEventHandler(async (event) => {
  const apiKey = process.env.API_KEY
  const seed: string | undefined = process.env.SEED_PHRASE
  if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' });
  if (!seed) throw new Error('Missing SEED_PHRASE');

  const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`);
  let wallet = ethers.Wallet.fromPhrase(seed);
  wallet = wallet.connect(provider);

  console.log(wallet)
  try {
    const body = await readBody<TxBody>(event);
    console.log('body line 17: ', body)
  } catch (err: any) {
    console.error(err.message)
  }
  const body = await readBody<TxBody>(event);
  if (!body?.to || !body?.value) {
    console.log(body)
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  console.log(body)

  const tx: ethers.TransactionRequest = {
    to: body.to,
    value: body.value ? ethers.parseEther(body.value) : undefined,
    data: body.data ?? undefined,
    gasLimit: body.gasLimit ? BigInt(body.gasLimit) : undefined,
    gasPrice: body.gasPrice ? BigInt(body.gasPrice) : undefined,
  };

  console.log(tx)

  try {
    const response = await wallet.sendTransaction(tx);
    console.log('TRY TEST')
    console.log(response)
    return { hash: response.hash };
  } catch (err: any) {
    console.log('ERROR:', err)
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
