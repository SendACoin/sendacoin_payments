import { format } from "date-fns";
import { prisma } from "../../../../../lib/prisma";
import InvoicesPage from "./invoices-page";

async function ViewInvoices({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const clientId = (await params).clientId;
  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId: clientId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      invoiceNumber: true,
      totalAmount: true,
      status: true,
      createdAt: true,

      dueDate: true,
    },
  });

  const formattedInvoices = invoices.map((invoice) => ({
    ...invoice,
    formattedCreatedAt: format(
      invoice?.createdAt ?? new Date(),
      "MMM dd, yyyy"
    ),
    formattedDueDate: format(invoice.dueDate, "MMM dd, yyyy"),
  }));

  // @ts-ignore
  return <InvoicesPage invoices={formattedInvoices} clientId={clientId} />;
}

export default ViewInvoices;
