export interface TradeRoute {
  fromToken: string;
  toToken: string;
  amount: string;
  minReceive: string;
  slippage: string;
}

export interface Balance {
  totalBalance: string;
  coinType: string;
}
