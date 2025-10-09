import { ethers } from 'ethers'

export default defineEventHandler(async (event) => {
  const { address } = await readBody(event)
  const apiKey = process.env.API_KEY

  if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' })

  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`  
  )

  const balance = await provider.getBalance(address)
  return { balance: ethers.formatEther(balance) }
})

// https://eth-sepolia.g.alchemy.com/v2/${apiKey}
//`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`  
