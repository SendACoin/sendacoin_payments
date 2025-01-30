"use client";

import { createInvoice } from "@/app/client/[clientId]/invoice/create/actions";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InvoiceLineItems } from "./invoice-line-items";

const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  notes: z.string().optional(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
    })
  ),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface CreateInvoiceFormProps {
  clientId: string;
}

export function CreateInvoiceForm({ clientId }: CreateInvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<InvoiceFormValues>({
    // @ts-ignore
    resolver: zodResolver(invoiceFormSchema) as any, // Type assertion to fix incompatible types
    defaultValues: {
      invoiceNumber: "",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    },
  });

  async function onSubmit(data: InvoiceFormValues) {
    setIsSubmitting(true);
    try {
      await createInvoice({
        clientId,
        invoiceNumber: data.invoiceNumber,
        dueDate: data.dueDate,
        items: data.lineItems,
        notes: data.notes || "",
      });

      toast({
        title: "Invoice created successfully",
        description: "Share the invoice link with your client",
      });
      router.push(`/client/${clientId}/invoice`);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast({
        title: "Failed to create invoice",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onSelect={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onSelect={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <InvoiceLineItems form={form} />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or payment instructions..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
