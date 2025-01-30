import { Suspense } from "react";
import { OrdersDataTable } from "./data-table";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const clientId = (await params).clientId;
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between"></div>
      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersDataTable clientId={clientId} />
      </Suspense>
    </div>
  );
}
