"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { InvoiceDetailsSkeleton } from "./invoice-details-skeleton";

interface InvoiceDetailsProps {
  invoiceId: string;
}

export function InvoiceDetails({ invoiceId }: InvoiceDetailsProps) {
  const { connected } = useWallet();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) throw new Error("Failed to fetch invoice");
      return response.json();
    },
  });

  if (isLoading) {
    return <InvoiceDetailsSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
          <Badge
            variant={
              invoice.status === PaymentStatus.PAID ? "success" : "secondary"
            }
          >
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p className="font-medium">{invoice.amount} SOL</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Created Date
            </p>
            <p className="font-medium">{formatDate(invoice.createdAt)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Recipient
            </p>
            <p className="font-medium break-all">{invoice.recipientAddress}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>
            <p className="font-medium">{invoice.description}</p>
          </div>
        </div>

        {invoice.status !== PaymentStatus.PAID && (
          <div className="flex justify-end mt-6">
            <Button size="lg" disabled={!connected}>
              {connected ? "Pay Invoice" : "Connect Wallet to Pay"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
