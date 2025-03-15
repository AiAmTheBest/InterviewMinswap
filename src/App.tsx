import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import SwapForm from "./components/SwapForm";
import { WalletProvider, Chain } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import "./App.css";

// Định nghĩa chain
const mainnetChain: Chain = {
  id: "mainnet",
  name: "Sui Mainnet",
  rpcUrl: "https://fullnode.mainnet.sui.io:443",
};

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");

  return (
    <WalletProvider chains={[mainnetChain]}>
      <div className="App">
        <WalletConnect
          setWalletAddress={setWalletAddress}
          setBalance={setBalance}
        />
        {walletAddress && (
          <SwapForm
            walletAddress={walletAddress}
            balance={balance}
            setBalance={setBalance}
          />
        )}
      </div>
    </WalletProvider>
  );
}

export default App;
