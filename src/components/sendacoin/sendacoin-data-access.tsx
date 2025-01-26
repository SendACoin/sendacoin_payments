"use client";

import { toast } from "@/hooks/use-toast";
import { BN, Program } from "@coral-xyz/anchor";
import {
  getSendacoinProgram,
  getSendacoinProgramId,
  type Sendacoin,
} from "@project/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Cluster, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useCluster } from "./cluster-data-access";
import { useAnchorProvider } from "./wallet-provider";

interface AdapterMethod<T, A> {
  type: "query" | "mutation";
  handler: (args: { program: Program<Sendacoin>; args?: A }) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

function createAdapter<T extends Record<string, AdapterMethod<any, any>>>({
  name,
  methods,
}: {
  name: string;
  methods: T;
}) {
  return {
    useQuery: (methodName: keyof T, { program, account, options = {} }: any) =>
      useQuery({
        queryKey: [name, methodName, account?.toString()],
        queryFn: () => methods[methodName].handler({ program, account }),
        ...options,
      }),
    useMutation: (methodName: keyof T, { program, args, onSuccess }: any) =>
      useMutation({
        mutationFn: (mutationArgs: any) =>
          methods[methodName].handler({
            program,
            args: { ...args, ...mutationArgs },
          }),
        onSuccess: (data) => {
          methods[methodName].onSuccess?.(data);
          onSuccess?.(data);
        },
        onError: methods[methodName].onError,
      }),
  };
}

interface CreateOrderArgs {
  title: string;
  message: string;
}

interface SendacoinProgramHook {
  program: Program<Sendacoin>;
  programId: PublicKey;
  accounts: ReturnType<typeof useQuery>;
  createOrder: UseMutationResult<string, Error, CreateOrderArgs, unknown>;
}

interface SendacoinAccountProps {
  account: PublicKey;
  payerWallet: PublicKey;
  payerUsdcAccount: PublicKey;
  merchantUsdcAccount: PublicKey;
  feeUsdcAccount: PublicKey;
}

export function useSendacoinProgram(): SendacoinProgramHook {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSendacoinProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getSendacoinProgram(provider);

  const accounts = useQuery({
    queryKey: ["sendacoin", "all", { cluster }],
    queryFn: () => program.account.paymentDetails.all(),
  });

  const createOrder = useMutation<string, Error, CreateOrderArgs>({
    mutationKey: ["sendacoin", "process_order", { cluster }],
    mutationFn: async ({ title, message }) => {
      if (!program.methods) throw new Error("Program methods not initialized");
      return program.methods.createJournalEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      toast({
        title: "Order Created",
        description: `Transaction signature: ${signature.slice(0, 8)}...`,
      });
      accounts.refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create journal entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    program,
    programId,
    accounts,
    createOrder,
  };
}

const sendacoinAdapter = createAdapter({
  name: "sendacoin",
  methods: {
    fetchPaymentDetails: {
      type: "query",
      handler: async ({ program, account }) => {
        if (!program.account?.paymentDetails) {
          throw new Error("Payment details account not initialized");
        }
        return program.account.paymentDetails.fetch(account);
      },
    },
    processOrder: {
      type: "mutation",
      handler: async ({ program, args }) => {
        const {
          payerWallet,
          payerUsdcAccount,
          merchantUsdcAccount,
          feeUsdcAccount,
        } = args;

        if (!program.methods) {
          throw new Error("Program methods not initialized");
        }

        const tx = await program.methods
          .processOrder("order123", new BN(100000000), false)
          .accounts({
            payer: payerWallet,
            payerTokenAccount: payerUsdcAccount,
            merchantTokenAccount: merchantUsdcAccount,
            feeAccount: feeUsdcAccount,
            merchantWallet: null,
            feeWallet: null,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        return tx;
      },
      onSuccess: (tx) => {
        toast({
          title: "Order Processed",
          description: `Transaction signature: ${tx.slice(0, 8)}...`,
        });
      },
      onError: (error: unknown) => {
        toast({
          title: "Order Processing Failed",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        throw error;
      },
    },
  },
});

export function useSendacoinAccount({
  account,
  payerWallet,
  payerUsdcAccount,
  merchantUsdcAccount,
  feeUsdcAccount,
}: SendacoinAccountProps) {
  const { program } = useSendacoinProgram();

  const paymentDetails = sendacoinAdapter.useQuery("fetchPaymentDetails", {
    program,
    account,
    options: {
      enabled: !!program && !!account,
    },
  });

  const processOrder = sendacoinAdapter.useMutation("processOrder", {
    program,
    onSuccess: () => {
      paymentDetails.refetch();
    },
    args: {
      payerWallet,
      payerUsdcAccount,
      merchantUsdcAccount,
      feeUsdcAccount,
    },
  });

  return {
    paymentDetails,
    processOrder,
  };
}
