export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface Invoice {
  id: string;
  amount: number;
  recipientAddress: string;
  description: string;
  status: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;
}
