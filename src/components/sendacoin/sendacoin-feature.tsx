"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "../ui/button";
import { useSendacoinProgram } from "./sendacoin-data-access";
import { SendacoinCard } from "./sendacoin-ui";

export default function SendacoinFeature() {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();

  const { publicKey } = useWallet();
  const { programId } = useSendacoinProgram();

  console.log("_________________________***_________________________");
  console.log("programId", programId);
  console.log("publicKey", publicKey);
  console.log("address", address);
  console.log("_________________________***_________________________");

  return address ? (
    <div>
      <SendacoinCard
        account={new PublicKey(address)}
        payerUsdcAccount={new PublicKey(address)}
        merchantUsdcAccount={
          new PublicKey(`A6GRszpxPoUBfAAr9g3igof16jTR2YXJevVmUpEuFc61`)
        }
        feeUsdcAccount={new PublicKey(address)}
      />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <Button size="lg" onClick={() => open()}>
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
