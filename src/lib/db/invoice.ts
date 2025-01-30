import { prisma } from "../../../lib/prisma";

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id },
      include: {
        items: true,
      },
    });
    return invoice;
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return null;
  }
}
