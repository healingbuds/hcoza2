'use client';

import { ReactNode } from 'react';
import { WagmiProvider, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

/**
 * Wallet Configuration for Admin NFT Gating
 * 
 * - Ethereum Mainnet only (where Dr. Green Digital Key NFTs are deployed)
 * - MetaMask and other ERC-721 compatible wallets supported via RainbowKit
 * - Admin-only feature - not exposed to customer-facing UI
 * 
 * NOTE: This provider does NOT include its own QueryClientProvider.
 * It relies on the parent QueryClientProvider from App.tsx to avoid conflicts.
 */
const config = getDefaultConfig({
  appName: 'Cannabis Platform',
  projectId: 'healing-buds-admin',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: false,
});

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        theme={{
          lightMode: lightTheme({
            accentColor: 'hsl(172, 66%, 40%)',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          }),
          darkMode: darkTheme({
            accentColor: 'hsl(172, 66%, 40%)',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          }),
        }}
        modalSize="compact"
        initialChain={mainnet}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export { config };
