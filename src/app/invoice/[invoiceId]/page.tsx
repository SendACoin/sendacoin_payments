import { InvoiceDetails } from "@/components/invoice/invoice-details";
import { InvoiceDetailsSkeleton } from "@/components/invoice/invoice-details-skeleton";
import { getInvoiceById } from "@/lib/db/invoice";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const invoiceId = (await params).invoiceId;

  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <Suspense fallback={<InvoiceDetailsSkeleton />}>
        {/* @ts-ignore */}
        <InvoiceDetails invoice={invoice} />
      </Suspense>
    </div>
  );
}
