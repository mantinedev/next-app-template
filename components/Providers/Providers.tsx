'use client';

import '@mantine/core/styles.css';
import React, { useCallback, useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Notifications } from '@mantine/notifications';
import { theme } from '../../theme';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useNetworkConfiguration } from '../../hooks/useNetworkConfiguration';

export function Providers({ children }: { children: React.ReactNode }) {
  const { endpoint } = useNetworkConfiguration();

  const wallets = useMemo(() => [new SolflareWalletAdapter(), new PhantomWalletAdapter()], []);

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
        <WalletProvider wallets={wallets} onError={onError}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </MantineProvider>
  );
}
