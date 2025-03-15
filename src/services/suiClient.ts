import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("mainnet") });

export const getBalance = async (
  address: string,
  coinType: string
): Promise<string> => {
  const balance = await client.getBalance({ owner: address, coinType });
  return balance.totalBalance;
};

export const signAndSubmitTransaction = async (tx: any, wallet: any) => {
  const signedTx = await wallet.signTransaction(tx);
  const result = await client.executeTransactionBlock({
    transactionBlock: signedTx,
    signature: signedTx.signature,
  });
  return result;
};
