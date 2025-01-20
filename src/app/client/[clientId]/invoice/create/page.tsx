import { CreateInvoiceForm } from "@/components/invoice/create-invoice-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface CreateInvoicePageProps {
  params: {
    clientId: string;
  };
}

export default function CreateInvoicePage({ params }: CreateInvoicePageProps) {
  return (
    <div className="container max-w-4xl py-8">
      <div className="px-6">
        <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
        <Suspense fallback={<CreateInvoiceFormSkeleton />}>
          <CreateInvoiceForm clientId={params.clientId} />
        </Suspense>
      </div>
    </div>
  );
}

function CreateInvoiceFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
