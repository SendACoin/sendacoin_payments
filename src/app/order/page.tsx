/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useGetBalance } from "@/components/sendacoin/account-data-access";
import { ClusterProvider } from "@/components/sendacoin/cluster-data-access";
import SendacoinFeature from "@/components/sendacoin/sendacoin-feature";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { shortenAddress } from "@/lib/utils";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface OrderData {
  amount: number;
  description: string;
}

const ShowBalance = ({ address }: { address: string }) => {
  const balance = useGetBalance({ address: new PublicKey(address) });
  return (
    <p className="font-bold">{balance.data ? String(balance.data) : "0"} SOL</p>
  );
};

export default function OrderPage() {
  const amountValue = "299";
  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    amount: amountValue ? parseFloat(amountValue) : 0,
    description: "",
  });

  const handleCreateOrder = async () => {
    setIsLoading(true);
    // TODO: Implement order creation logic
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-20">
      <div className="flex justify-between items-center">
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
      {address && (
        <Alert variant="default" className="mb-6 bg-white mt-10">
          <AlertCircle className="h-4 w-4 mt-1" />
          <AlertDescription className="flex items-center justify-between">
            <span>Your balance is low </span>
            <Button onClick={() => open()}>Fund Wallet</Button>
          </AlertDescription>
        </Alert>
      )}
      <Card className="p-6 ">
        <div className="flex items-center bg-gray-50 rounded-md p-1">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
            className="object-cover rounded-lg w-10 h-10 mr-2"
          />
          <p className="font-semibold">Premium Wireless Headphones</p>
        </div>
        <div className="space-y-4 mt-6">
          <div className="font-semibold">
            {amountValue ? (
              <>
                <label className="block text-sm font-medium mb-2">Amount</label>
                ${amountValue}
              </>
            ) : (
              <>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  value={orderData.amount}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))
                  }
                  placeholder="Enter amount"
                />
              </>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Input
              value={orderData.description}
              onChange={(e) =>
                setOrderData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
            />
          </div> */}

          <ClusterProvider>
            <SendacoinFeature />
          </ClusterProvider>
        </div>
      </Card>
    </div>
  );
}
