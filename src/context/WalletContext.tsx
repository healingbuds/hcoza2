'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useDrGreenKeyOwnership } from '@/hooks/useNFTOwnership';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';

interface WalletContextValue {
  // Connection state
  isConnected: boolean;
  address: string | undefined;
  
  // NFT ownership
  hasDigitalKey: boolean;
  isCheckingNFT: boolean;
  
  // Modal control
  openWalletModal: () => void;
  closeWalletModal: () => void;
  isWalletModalOpen: boolean;
  
  // Hydration status
  isHydrated: boolean;
  
  // Error state
  walletError: Error | null;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

interface WalletContextProviderProps {
  children: ReactNode;
}

/**
 * Wallet Context Provider - Manages wallet connection state and NFT ownership
 * This provides the "Hydration Layer" for the dApp architecture
 * 
 * Includes error handling to prevent wagmi initialization failures from crashing the app
 */
export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletError, setWalletError] = useState<Error | null>(null);
  
  // Safely get account state - wagmi hooks can fail if provider isn't ready
  let isConnected = false;
  let address: string | undefined;
  
  try {
    const account = useAccount();
    isConnected = account.isConnected;
    address = account.address;
  } catch (error) {
    // Log but don't crash - wallet features will be disabled
    console.warn('[WalletContext] Failed to initialize useAccount:', error);
    if (!walletError && error instanceof Error) {
      setWalletError(error);
    }
  }

  // NFT ownership check - also wrapped in error handling
  let hasNFT = false;
  let nftLoading = false;
  
  try {
    const nftOwnership = useDrGreenKeyOwnership();
    hasNFT = nftOwnership.hasNFT;
    nftLoading = nftOwnership.isLoading;
  } catch (error) {
    console.warn('[WalletContext] Failed to check NFT ownership:', error);
  }

  // App is "hydrated" when wallet is connected and NFT check is complete
  const isHydrated = isConnected && !nftLoading;

  // Log wallet state for debugging
  useEffect(() => {
    if (walletError) {
      console.warn('[WalletContext] Wallet initialization error - wallet features disabled:', walletError.message);
    }
  }, [walletError]);

  const value: WalletContextValue = {
    isConnected,
    address,
    hasDigitalKey: hasNFT,
    isCheckingNFT: nftLoading,
    openWalletModal: () => setIsModalOpen(true),
    closeWalletModal: () => setIsModalOpen(false),
    isWalletModalOpen: isModalOpen,
    isHydrated,
    walletError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
      {/* Global wallet modal - accessible from anywhere */}
      <WalletConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletContextProvider');
  }
  return context;
}

export { WalletContext };
