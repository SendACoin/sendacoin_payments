import { InvoiceDetails } from "@/components/invoice/invoice-details";
import { InvoiceDetailsSkeleton } from "@/components/invoice/invoice-details-skeleton";
import { getInvoiceById } from "@/lib/db/invoice";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface InvoicePageProps {
  params: {
    invoiceId: string;
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const invoice = await getInvoiceById(params.invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8">
      <Suspense fallback={<InvoiceDetailsSkeleton />}>
        <InvoiceDetails invoiceId={params.invoiceId} />
      </Suspense>
    </div>
  );
}
