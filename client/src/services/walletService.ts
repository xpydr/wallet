
import API from "@/api";

export async function getBalance(address: string): Promise<string> {
  const res = await API.post("/get-balance", { address });
  console.log(res)
  return res.data.balance;
}

export async function broadcastTx(txSigned: string): Promise<string> {
  const res = await API.post("/send-tx", { txSigned });
  console.log(res)
  return res.data.hash;
}

export async function getTxData(address: string): Promise<object> {
  const res = await API.post("/get-tx-data", { address });
  console.log(res)
  return res.data;
}
