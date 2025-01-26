"use client";

import { PublicKey } from "@solana/web3.js";
import { Button } from "../ui/button";
import { useSendacoinAccount } from "./sendacoin-data-access";

export function SendacoinCard({
  account,
  payerUsdcAccount,
  merchantUsdcAccount,
  feeUsdcAccount,
}: {
  account: PublicKey;
  payerUsdcAccount: PublicKey;
  merchantUsdcAccount: PublicKey;
  feeUsdcAccount: PublicKey;
}) {
  const { processOrder } = useSendacoinAccount({
    account,
    payerWallet: account,
    payerUsdcAccount: payerUsdcAccount,
    merchantUsdcAccount: merchantUsdcAccount,
    feeUsdcAccount: feeUsdcAccount,
  });

  return processOrder.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div>
      <div>
        <div className="space-y-6">
          <div className="card-actions justify-around">
            <Button
              className="btn btn-xs lg:btn-md btn-outline w-full"
              onClick={() => processOrder.mutateAsync()}
              disabled={processOrder.isPending}
            >
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
