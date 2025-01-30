import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Suspense } from "react";
import InfoMessage from "./InfoMessage";

const getInvoiceStats = async () => {
  const total = await db.invoice.count();
  const pending = await db.invoice.count({
    where: {
      status: "PENDING",
    },
  });

  return {
    total: total,
    pending: pending,
  };
};
const getOrderStats = async () => {
  const total = await db.order.count();
  const pending = await db.order.count({
    where: {
      status: "PENDING",
    },
  });

  return {
    total: total,
    pending: pending,
  };
};

interface StatsCardProps {
  title: string;
  value: number;
  loading?: boolean;
}

const StatsCard = ({ title, value, loading }: StatsCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-center gap-2">
        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </Card>
  );
};

async function ClientStats() {
  const orderStats = await getOrderStats();
  const invoiceStats = await getInvoiceStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Orders" value={orderStats.total} />
      <StatsCard title="Total Invoices" value={invoiceStats.total} />
      <StatsCard title="Pending Orders" value={orderStats.pending} />
      <StatsCard title="Pending Invoices" value={invoiceStats.pending} />
    </div>
  );
}

const Page = () => {
  return (
    <div className="container py-8">
      <InfoMessage />

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Orders" value={0} loading />
            <StatsCard title="Total Invoices" value={0} loading />
            <StatsCard title="Pending Orders" value={0} loading />
            <StatsCard title="Pending Invoices" value={0} loading />
          </div>
        }
      >
        <ClientStats />
      </Suspense>
    </div>
  );
};

export default Page;
