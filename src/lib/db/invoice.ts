import { prisma } from "../../../lib/prisma";


export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });
    return invoice;
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return null;
  }
}
