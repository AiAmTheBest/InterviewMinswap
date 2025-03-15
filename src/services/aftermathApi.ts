import axios from "axios";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import Big from "big.js";

const BASE_URL = "https://aftermath.finance/api";

export const getTradeRoute = async (
  fromToken: string,
  toToken: string,
  amount: string,
  slippage: string
): Promise<any> => {
  try {
    const amountInMist = new Big(amount).times(Number(MIST_PER_SUI)).toString();
    const payload = {
      fromToken: fromToken === "SUI" ? "0x2::sui::SUI" : fromToken,
      toToken: toToken === "CETUS" ? "0xCETUS_ADDRESS" : toToken,
      amount: amountInMist,
      slippage: (parseFloat(slippage) / 100).toString(),
    };
    console.log(
      "Sending request to /router/trade-route with payload:",
      payload
    );
    const response = await axios.post(
      `${BASE_URL}/router/trade-route`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling /router/trade-route:");
    throw error;
  }
};

export const getTradeTransaction = async (
  route: any,
  amount: string
): Promise<any> => {
  try {
    const amountInMist = new Big(amount).times(Number(MIST_PER_SUI)).toString();
    const payload = {
      route,
      amount: amountInMist,
    };
    console.log(
      "Sending request to /router/transactions/trade with payload:",
      payload
    );
    const response = await axios.post(
      `${BASE_URL}/router/transactions/trade`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling /router/transactions/trade:");
    throw error;
  }
};

export const getPriceInfo = async (
  token: string,
  amount: string
): Promise<{ fiatValue: number }> => {
  const amountInMist = new Big(amount).times(Number(MIST_PER_SUI)).toString();
  const response = await axios.get(`${BASE_URL}/price-info`, {
    params: {
      token: token === "SUI" ? "0x2::sui::SUI" : token,
      amount: amountInMist,
    },
  });
  return response.data;
};
