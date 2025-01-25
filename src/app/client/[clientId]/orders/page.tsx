import { Suspense } from "react";
import { OrdersDataTable } from "./data-table";

interface OrdersPageProps {
  params: {
    clientId: string;
  };
}

export default function OrdersPage({ params }: OrdersPageProps) {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between"></div>
      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersDataTable clientId={params.clientId} />
      </Suspense>
    </div>
  );
}
