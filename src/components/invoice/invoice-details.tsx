"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatus } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";
import { Invoice, InvoiceItem } from "@prisma/client";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { ClusterProvider } from "../sendacoin/cluster-data-access";
import SendacoinFeature from "../sendacoin/sendacoin-feature";
import { InvoiceDetailsSkeleton } from "./invoice-details-skeleton";

interface InvoiceDetailsProps {
  invoiceId: string;
  invoice: Invoice & { items: InvoiceItem[] };
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  if (!invoice) {
    return <InvoiceDetailsSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            Invoice #{invoice.invoiceNumber}
          </CardTitle>
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
            <p className="font-medium">{invoice.totalAmount?.toString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Created Date
            </p>
            <p className="font-medium">
              {formatDate(invoice?.createdAt ?? new Date())}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>
            <p className="font-medium">{invoice.notes}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4"></h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted text-sm font-medium">
              <div>Description</div>
              <div className="text-right">Quantity</div>
              <div className="text-right">Unit Price</div>
              <div className="text-right">Total</div>
            </div>
            <div className="divide-y">
              {invoice.items?.map((item) => (
                <div key={item.id} className="grid grid-cols-4 gap-4 p-4">
                  <div>{item.description}</div>
                  <div className="text-right">{item.quantity}</div>
                  <div className="text-right">{item.unitPrice}</div>
                  <div className="text-right">
                    {item.quantity * item.unitPrice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {invoice.status !== PaymentStatus.PAID && (
          <div className="flex justify-between mt-6">
            <div>
              {address && (
                <div className="flex items-center gap-2">
                  <p
                    className="cursor-pointer bg-white px-4 rounded-md py-1 shadow-sm text-gray-600 hover:text-gray-900 py-1"
                    onClick={() => open()}
                  >
                    {shortenAddress(address)}
                  </p>
                </div>
              )}
            </div>
            <ClusterProvider>
              <SendacoinFeature />
            </ClusterProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
