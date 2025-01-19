"use client";

import { getSendacoinProgram, getSendacoinProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { toast } from "@/hooks/use-toast";
import { BN } from "@coral-xyz/anchor";
import { useCluster } from "./cluster-data-access";
import { useAnchorProvider } from "./solana-provider";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export function useSendacoinProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSendacoinProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getSendacoinProgram(provider, programId),
    [provider, programId]
  );

  const accounts = useQuery({
    queryKey: ["sendacoin", "all", { cluster }],
    queryFn: () => program.account.sendacoin.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["sendacoin", "initialize", { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ sendacoin: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      console.log(signature);
      return accounts.refetch();
    },
    onError: () => toast({ message: "Failed to initialize account" }),
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
}: {
  account: PublicKey;
  payerWallet: PublicKey;
  payerUsdcAccount: PublicKey;
  merchantUsdcAccount: PublicKey;
  feeUsdcAccount: PublicKey;
}) {
  const { cluster } = useCluster();
  const { program, accounts } = useSendacoinProgram();

  const accountQuery = useQuery({
    queryKey: ["sendacoin", "fetch", { cluster, account }],
    queryFn: () => program.account.sendacoin.fetch(account),
  });

  const incrementMutation = useMutation({
    mutationKey: ["sendacoin", "increment", { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ sendacoin: account }).rpc(),
    onSuccess: (tx) => {
      alert(tx);
      return accountQuery.refetch();
    },
  });

  const placeOrderMutation = useMutation({
    mutationKey: ["sendacoin", "place-order", { cluster, account }],
    mutationFn: () =>
      program.methods
        .processOrder("order123", new BN(100000000), false) // false for SPL tokens
        .accounts({
          payer: payerWallet,
          payerTokenAccount: payerUsdcAccount,
          merchantTokenAccount: merchantUsdcAccount,
          feeAccount: feeUsdcAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          // Set these to null
          merchantWallet: null,
          feeWallet: null,
          systemProgram: null,
        })
        .rpc(),
    onSuccess: (tx) => {
      alert(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    incrementMutation,
    placeOrderMutation,
  };
}
