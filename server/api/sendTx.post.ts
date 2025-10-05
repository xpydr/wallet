import { sendTransaction } from '~/services/walletService';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const hash = await sendTransaction(body);
  return { hash };
});