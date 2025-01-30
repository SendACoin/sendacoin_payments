"use client";

import { Button } from "@/components/ui/button";
import { Invoice } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { DataTable } from "./data-table";

interface Row {
  row: {
    original: Invoice;
  };
}

const columns = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: Row) => row.original.totalAmount,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: Row) => (
      <div
        className={`capitalize ${
          // @ts-ignore
          row.original.status == "paid" ? "text-green-600" : "text-yellow-600"
        }`}
      >
        {row.original.status}
      </div>
    ),
  },
  {
    accessorKey: "formattedCreatedAt",
    header: "Created",
  },
  {
    accessorKey: "formattedDueDate",
    header: "Due Date",
  },
];

function InvoicesPage({
  invoices,
  clientId,
}: {
  invoices: Invoice[];
  clientId: string;
}) {
  const formattedInvoices = invoices.map((invoice) => ({
    ...invoice,
    formattedCreatedAt: format(invoice.createdAt ?? new Date(), "MMM dd, yyyy"),
    formattedDueDate: format(invoice.dueDate, "MMM dd, yyyy"),
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>

        <Link href={`/client/${clientId}/invoice/create`}>
          <Button>Create Invoice</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={formattedInvoices}
        searchKey="invoiceNumber"
      />
    </div>
  );
}

export default InvoicesPage;
