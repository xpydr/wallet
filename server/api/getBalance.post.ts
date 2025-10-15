import { ethers } from 'ethers'

export default defineEventHandler(async (event) => {
    const { address } = await readBody(event);
    const apiKey = process.env.API_KEY;

    if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' });

    const config = useRuntimeConfig();
    const provider = new ethers.JsonRpcProvider(config.public.rpcUrl);

    const balance = await provider.getBalance(address);
    return { balance: ethers.formatEther(balance) }
})
