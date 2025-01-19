"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { ellipsify } from "@/lib/utils";
import { useAppKit } from "@reown/appkit/react";
import { Button } from "../ui/button";
import { ExplorerLink } from "./cluster-ui";
import { useSendacoinProgram } from "./sendacoin-data-access";
import { SendacoinCreate, SendacoinList } from "./sendacoin-ui";

export default function SendacoinFeature() {
  const { open } = useAppKit();

  const { publicKey } = useWallet();
  const { programId } = useSendacoinProgram();

  return publicKey ? (
    <div>
      <p className="mb-6">
        <ExplorerLink
          path={`account/${programId}`}
          label={ellipsify(programId.toString())}
        />
      </p>
      <SendacoinCreate />

      <SendacoinList />
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
