"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { InvoiceFormValues } from "./create-invoice-form";

interface InvoiceLineItemsProps {
  form: UseFormReturn<InvoiceFormValues>;
}

export function InvoiceLineItems({ form }: InvoiceLineItemsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Line Items</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
        >
          Add Item
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name={`lineItems.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`lineItems.${index}.quantity`}
            render={({ field }) => (
              <FormItem className="w-24">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`lineItems.${index}.unitPrice`}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel>Unit Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-8"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
