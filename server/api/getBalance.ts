import { ethers } from 'ethers'

export default defineEventHandler(async (event) => {
  const { address } = await readBody(event)
  const apiKey = process.env.API_KEY // Private, server-only

  if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' })

  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`  
  )

  // const provider = ethers.getDefaultProvider("sepolia");


  // const balance = await provider.getBalance(address)
  const balance = await provider.getBalance('0x9427CD0567616c596B3D316432B9A9CDd5e4328f')
  return { balance: ethers.formatEther(balance) }
})

// https://eth-sepolia.g.alchemy.com/v2/${apiKey}
//`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`  
