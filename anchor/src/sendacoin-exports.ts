"use client";

// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import SendacoinIDL from "../target/idl/sendacoin.json";
import type { Sendacoin } from "../target/types/sendacoin";

// Re-export the generated IDL and type
export { Sendacoin, SendacoinIDL };

// The programId is imported from the program IDL.
export const SENDACOIN_PROGRAM_ID = new PublicKey(SendacoinIDL.address);

// This is a helper function to get the Sendacoin Anchor program.
export function getSendacoinProgram(
  provider: AnchorProvider,
  address?: PublicKey
) {
  if (!provider) {
    throw new Error(
      "AnchorProvider is required to initialize the Sendacoin program"
    );
  }

  const programId = address?.toBase58() || SendacoinIDL.address;

  return new Program<Sendacoin>(SendacoinIDL as any, programId, provider);
}

// This is a helper function to get the program ID for the Sendacoin program depending on the cluster.
export function getSendacoinProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
      // This is the program ID for the Sendacoin program on devnet and testnet.
      return new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
    case "mainnet-beta":
    default:
      return SENDACOIN_PROGRAM_ID;
  }
}
