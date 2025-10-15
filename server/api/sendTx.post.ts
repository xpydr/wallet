import { ethers } from 'ethers';

export default defineEventHandler(async (event) => {

    const apiKey = process.env.API_KEY;
    if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' });

    const config = useRuntimeConfig();
    const provider = new ethers.JsonRpcProvider(config.public.rpcUrl);

    const body = await readBody<{ txSigned: string }>(event);
    const txSigned: string = body.txSigned;

    try {
        const res = await provider.broadcastTransaction(txSigned);
        return { hash: res.hash };
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});