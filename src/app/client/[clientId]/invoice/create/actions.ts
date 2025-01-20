"use server";

interface CreateInvoiceParams {
  clientId: string;
  dueDate: Date;
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
}
