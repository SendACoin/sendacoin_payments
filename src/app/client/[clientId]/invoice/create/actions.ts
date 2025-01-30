"use server";

import { db } from "@/lib/db";
import { randomUUID } from "crypto";

interface CreateInvoiceParams {
  clientId: string;
  dueDate: Date;
  invoiceNumber: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes: string;
}

export async function createInvoice(params: CreateInvoiceParams) {
  // TODO: Implement invoice creation logic
  console.log("Creating invoice:", params);
  console.log({
    invoiceNumber: params.invoiceNumber,
    totalAmount: params.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    ),
    userId: "4693e060-a392-4b96-989b-9c18212bdb9a",
    organizationId: "550e8400-e29b-41d4-a716-446655440000",
    dueDate: params.dueDate,
    notes: params?.notes ?? "",
  });
  const invoice = await db.invoice.create({
    data: {
      id: randomUUID(),
      invoiceNumber: params.invoiceNumber,
      totalAmount: params.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ),
      userId: "4693e060-a392-4b96-989b-9c18212bdb9a",
      organizationId: "550e8400-e29b-41d4-a716-446655440000",
      dueDate: params.dueDate,
      notes: params?.notes ?? "",
    },
  });

  await db.invoiceItem.createMany({
    data: params.items.map((item) => ({
      name: item.description, // Map description to name field
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice, // Calculate total price
      invoiceId: invoice.id,
    })),
  });
}
