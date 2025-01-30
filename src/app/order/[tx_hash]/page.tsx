"use client";

import { useGetBalance } from "@/components/sendacoin/account-data-access";
import { Card } from "@/components/ui/card";
import { shortenAddress } from "@/lib/utils";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";
import { CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

interface OrderData {
  amount: number;
  description: string;
}

const ShowBalance = ({ address }: { address: string }) => {
  const balance = useGetBalance({ address: new PublicKey(address) });
  return (
    <p className="font-bold">
      {balance.data ? String(balance.data / 1000000000) : "0"} SOL
    </p>
  );
};

export default function OrderPage() {
  const params = useParams();
  const txHash = params.tx_hash;

  const amountValue = "299";
  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-20">
      <div className="flex justify-between items-center mb-5">
        <img
          src="https://www.devzstudio.com/assets/images/logo.svg"
          className="pl-5"
          alt="DevzStudio Logo"
        />
        {address && (
          <div className="flex items-center gap-2">
            <ShowBalance address={address} />
            <p
              className="cursor-pointer bg-white px-4 rounded-md py-1 shadow-sm text-gray-600 hover:text-gray-900 py-1"
              onClick={() => open()}
            >
              {shortenAddress(address)}
            </p>
          </div>
        )}
      </div>

      <Card className="p-6 ">
        <div className="space-y-4 mt-6">
          <div className="font-semibold overflow-hidden">
            <label className="block text-sm font-medium mb-2">Tx Hash</label>
            <span className="text-xs text-[10px]">{txHash}</span>
          </div>

          <p className="text-green-500 text-center flex items-center gap-2 justify-center">
            <CheckCircle className="h-4 w-4 mt-1" />
            Payment Processed Successfully!
          </p>
        </div>
      </Card>
    </div>
  );
}
