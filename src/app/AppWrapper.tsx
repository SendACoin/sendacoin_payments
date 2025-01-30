"use client";

import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo, useState } from "react";

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: "AppKit",
  description: "AppKit Solana Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Create modal
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    onramp: true,
    email: true,
    socials: ["google", "x", "github", "discord", "farcaster"],
    emailShowWallets: true,
  },
  themeMode: "light",
});

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(new QueryClient());

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <QueryClientProvider client={client}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>{children}</WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export default AppLayout;
