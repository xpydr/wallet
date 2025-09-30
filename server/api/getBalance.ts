// server/api/getBalance.ts
import { ethers } from 'ethers'

export default defineEventHandler(async (event) => {
  const { address } = await readBody(event)
  const apiKey = process.env.API_KEY // Private, server-only

  if (!apiKey) throw createError({ statusCode: 500, message: 'API key missing' })

  const provider = new ethers.JsonRpcProvider(
    `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`  
  )
  const balance = await provider.getBalance(address)
  return { balance: ethers.formatEther(balance) }
})