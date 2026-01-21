import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Parrhesia",
      preference: {
        options: "smartWalletOnly",
      },
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // Enable experimental features for Smart Wallets
  multiInjectedProviderDiscovery: true,
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
