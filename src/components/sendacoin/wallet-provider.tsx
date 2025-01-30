import { AnchorProvider } from "@coral-xyz/anchor";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import {
  Connection,
  useAppKitConnection,
} from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function useAnchorProvider() {
  const { connection } = useAppKitConnection();
  const { address } = useAppKitAccount();

  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const wallet = {
    address: address,
    signTransaction: async () => {
      const latestBlockhash = await connection?.getLatestBlockhash();

      // create the transaction
      const transaction = new Transaction({
        feePayer: new PublicKey(address as string),
        recentBlockhash: latestBlockhash?.blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(address as string),
          toPubkey: new PublicKey(address as string), // destination address
          lamports: 200000,
        }),
        SystemProgram.transfer({
          fromPubkey: new PublicKey(address as string),
          toPubkey: new PublicKey(address as string), // destination address
          lamports: 1000,
        })
      );

      // raise the modal
      const signature = await walletProvider.sendTransaction(
        transaction,
        connection as Connection
      );

      // print the Transaction Signature
      console.log(signature);

      return transaction;
    },
  };

  return new AnchorProvider(connection as Connection, wallet as any, {
    commitment: "confirmed",
  });
}
