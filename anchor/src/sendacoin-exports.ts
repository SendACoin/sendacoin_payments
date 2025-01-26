"use client";

// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import SendacoinIDL from "../target/idl/sendacoin.json";
import type { Sendacoin } from "../target/types/sendacoin";

// Re-export the generated IDL and type
export { Sendacoin, SendacoinIDL };

// The programId is imported from the program IDL.
export const SENDACOIN_PROGRAM_ID = new PublicKey(
  "F5jE4FMaARnKG79qLMtaGmhNHjb1LM9s2Bo3wH6QYZRK"
);

// This is a helper function to get the Sendacoin Anchor program.
export function getSendacoinProgram(
  provider: AnchorProvider,
  address?: PublicKey
) {
  return new Program(SendacoinIDL as any, provider);
}

export function getSendacoinProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return SENDACOIN_PROGRAM_ID;
  }
}
