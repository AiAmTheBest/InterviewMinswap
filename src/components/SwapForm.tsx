import Big from "big.js"; // Đảm bảo import Big
import { useState, useEffect } from "react";
import {
  getTradeRoute,
  getTradeTransaction,
  getPriceInfo,
} from "../services/aftermathApi";
import { getBalance, signAndSubmitTransaction } from "../services/suiClient";
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

interface SwapFormProps {
  walletAddress: string;
  balance: string;
  setBalance: (value: string) => void;
}

const SwapForm = ({ walletAddress, balance, setBalance }: SwapFormProps) => {
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [slippage, setSlippage] = useState("0.5");
  const [fiatIn, setFiatIn] = useState(0);
  const [fiatOut, setFiatOut] = useState(0);

  const updateFiatValues = async () => {
    if (amountIn) {
      const priceInfoIn = await getPriceInfo("SUI", amountIn);
      setFiatIn(priceInfoIn.fiatValue);
    }
    if (amountOut) {
      const priceInfoOut = await getPriceInfo("CETUS", amountOut);
      setFiatOut(priceInfoOut.fiatValue);
    }
  };

  const handleSwap = async () => {
    const route = await getTradeRoute("SUI", "CETUS", amountIn, slippage);
    setAmountOut(route.minReceive);
    await updateFiatValues();
    const tx = await getTradeTransaction(route, amountIn);
    await signAndSubmitTransaction(tx, {
      signTransaction: () => Promise.resolve({}),
    });
  };

  const handleHalf = () => {
    const bigBalance = new Big(balance);
    const halfAmount = bigBalance.div(2).toString();
    setAmountIn(halfAmount);
    updateFiatValues();
  };

  const handleMax = () => {
    setAmountIn(balance);
    updateFiatValues();
  };

  const switchDirection = () => {
    const tempAmount = amountIn;
    setAmountIn(amountOut);
    setAmountOut(tempAmount);
    updateFiatValues();
  };

  useEffect(() => {
    if (walletAddress) {
      getBalance(walletAddress, "0x2::sui::SUI").then(setBalance);
    }
    updateFiatValues();
  }, [walletAddress, amountIn, amountOut]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          backgroundColor: "#1E1E1E",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3>Swap</h3>
            <p style={{ color: "#B0B0B0" }}>Balance: {balance} SUI</p>
          </div>

          <TextField
            fullWidth
            type="number"
            value={amountIn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmountIn(e.target.value)
            }
            label="Amount in (SUI)"
            variant="outlined"
            InputProps={{ style: { color: "white" } }}
            style={{
              marginBottom: "10px",
              backgroundColor: "#333",
              borderRadius: "5px",
            }}
          />
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleHalf}
            >
              Half
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleMax}
            >
              Max
            </Button>
          </div>

          <p style={{ color: "#B0B0B0" }}>Fiat Value: ${fiatIn.toFixed(2)}</p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0",
            }}
          >
            <IconButton color="secondary" onClick={switchDirection}>
              <SwapHorizIcon fontSize="large" />
            </IconButton>
          </div>

          <h4>You receive: {amountOut} CETUS</h4>
          <p style={{ color: "#B0B0B0" }}>Fiat Value: ${fiatOut.toFixed(2)}</p>

          <TextField
            fullWidth
            type="number"
            value={slippage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSlippage(e.target.value)
            }
            label="Slippage (%)"
            variant="outlined"
            InputProps={{ style: { color: "white" } }}
            style={{
              marginTop: "10px",
              backgroundColor: "#333",
              borderRadius: "5px",
            }}
          />

          <Button
            variant="contained"
            color="success"
            fullWidth
            style={{ marginTop: "10px" }}
            onClick={handleSwap}
          >
            Trade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwapForm;
