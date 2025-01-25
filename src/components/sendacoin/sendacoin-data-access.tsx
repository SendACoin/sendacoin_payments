"use client";

import { toast } from "@/hooks/use-toast";
import { BN } from "@coral-xyz/anchor";
import {
  getSendacoinProgram,
  getSendacoinProgramId,
  type Sendacoin,
} from "@project/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useCluster } from "./cluster-data-access";
import { useAnchorProvider } from "./wallet-provider";

interface SendacoinProgramHook {
  program: Sendacoin;
  programId: PublicKey;
  accounts: ReturnType<typeof useQuery>;
  getProgramAccount: ReturnType<typeof useQuery>;
  initialize: ReturnType<typeof useMutation>;
}

interface SendacoinAccountProps {
  account: PublicKey;
  payerWallet: PublicKey;
  payerUsdcAccount: PublicKey;
  merchantUsdcAccount: PublicKey;
  feeUsdcAccount: PublicKey;
}

export function useSendacoinProgram(): SendacoinProgramHook {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();

  console.log("cluster", cluster);

  const programId = useMemo(
    () => getSendacoinProgramId(cluster.network as Cluster),
    [cluster]
  );

  const program = useMemo(() => {
    try {
      const prog = getSendacoinProgram(provider, programId);
      if (!prog || !prog.account) {
        console.error("Failed to initialize Sendacoin program");
        throw new Error("Program initialization failed");
      }
      return prog;
    } catch (error) {
      console.error("Error initializing Sendacoin program:", error);
      throw error;
    }
  }, [provider, programId]);

  const accounts = useQuery({
    queryKey: ["sendacoin", "all", { cluster }],
    queryFn: async () => {
      if (!program?.account?.paymentDetails) {
        throw new Error("Payment details account not initialized");
      }
      return program.account.paymentDetails.all();
    },
    retry: false,
    enabled: !!program?.account?.paymentDetails,
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["sendacoin", "initialize", { cluster }],
    mutationFn: async (keypair: Keypair) => {
      try {
        const signature = await program.methods
          .processOrder("init", new BN(0), false)
          .accounts({
            payer: keypair.publicKey,
            payerTokenAccount: null,
            merchantTokenAccount: null,
            feeAccount: null,
            merchantWallet: null,
            feeWallet: null,
            paymentDetails: keypair.publicKey,
            systemProgramId: SystemProgram.programId,
            tokenProgramId: TOKEN_PROGRAM_ID,
          })
          .signers([keypair])
          .rpc();
        return signature;
      } catch (error) {
        toast({
          title: "Initialization Failed",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (signature) => {
      toast({
        title: "Success",
        description: `Account initialized. Signature: ${signature.slice(
          0,
          8
        )}...`,
      });
      return accounts.refetch();
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useSendacoinProgramAccount({
  account,
  payerWallet,
  payerUsdcAccount,
  merchantUsdcAccount,
  feeUsdcAccount,
}: SendacoinAccountProps) {
  const { cluster } = useCluster();
  const { program } = useSendacoinProgram();

  const accountQuery = useQuery({
    queryKey: ["sendacoin", "fetch", { cluster, account: account.toString() }],
    queryFn: () => program.account.paymentDetails.fetch(account),
  });

  const placeOrderMutation = useMutation({
    mutationKey: [
      "sendacoin",
      "place-order",
      { cluster, account: account.toString() },
    ],
    mutationFn: async () => {
      try {
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
      } catch (error) {
        toast({
          title: "Order Processing Failed",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (tx) => {
      toast({
        title: "Order Processed",
        description: `Transaction signature: ${tx.slice(0, 8)}...`,
      });
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    placeOrderMutation,
  };
}
