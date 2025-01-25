import { format } from "date-fns";
import { prisma } from "../../../../../lib/prisma";
import InvoicesPage from "./invoices-page";

async function ViewInvoices({ params }: { params: { clientId: string } }) {
  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId: params.clientId,
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
    formattedCreatedAt: format(invoice.createdAt, "MMM dd, yyyy"),
    formattedDueDate: format(invoice.dueDate, "MMM dd, yyyy"),
  }));

  return (
    <InvoicesPage invoices={formattedInvoices} clientId={params.clientId} />
  );
}

export default ViewInvoices;
