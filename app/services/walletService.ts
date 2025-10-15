export async function sendTxApi(payload: { txSigned: string }) {
    try {
        return await $fetch<{ hash: string }>('/api/sendTx', {
            method: 'POST',
            body: payload
        });
    } catch (err) {
        console.error(err)
    }
}

export async function fetchBalance(address: string): Promise<string> {
    const response = await $fetch<{ balance: string }>('/api/getBalance', {
        method: 'POST',
        body: { address: address },
    });
    return response.balance;
}