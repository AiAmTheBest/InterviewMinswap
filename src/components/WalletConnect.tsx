import { useState } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { getBalance } from "../services/suiClient";

const WalletConnect = ({
  setWalletAddress,
  setBalance,
}: {
  setWalletAddress: (addr: string) => void;
  setBalance: (bal: string) => void;
}) => {
  const wallet = useWallet();
  const [error, setError] = useState<string | null>(null);

  const updateBalance = async () => {
    if (wallet.account?.address) {
      try {
        const balance = await getBalance(
          wallet.account.address,
          "0x2::sui::SUI"
        );
        setBalance(balance);
        setWalletAddress(wallet.account.address);
      } catch (err) {
        setError("Failed to fetch balance: " + (err as Error).message);
        console.error("Balance fetch error:", err);
      }
    }
  };

  const handleConnectSuccess = async (walletName: string) => {
    console.log("Connected to wallet:", walletName);
    await updateBalance();
  };

  const handleConnectError = (err: Error) => {
    setError("Failed to connect wallet: " + err.message);
    console.error("Wallet connection error:", err);
  };

  return (
    <div>
      <ConnectButton
        label={wallet.account?.address ? "Connected" : "Connect Wallet"}
        onConnectSuccess={handleConnectSuccess}
        onConnectError={handleConnectError}
      />
      {wallet.account?.address && <p>Address: {wallet.account.address}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WalletConnect;
