"use client";

import { ClusterProvider } from "@/components/sendacoin/cluster-data-access";
import SendacoinFeature from "@/components/sendacoin/sendacoin-feature";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface OrderData {
  amount: number;
  description: string;
}

export default function OrderPage() {
  const searchParams = useSearchParams();
  const amountValue = searchParams.get("amount");

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
      <img
        src="https://www.devzstudio.com/assets/images/logo.svg"
        className="pl-5"
        alt="DevzStudio Logo"
      />
      <Card className="p-6 mt-10">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        </p>

        <div className="space-y-4 mt-6">
          <div>
            {amountValue ? (
              <>
                <label className="block text-sm font-medium mb-2">Amount</label>
                {amountValue}
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
