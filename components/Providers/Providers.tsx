'use client';

import '@mantine/core/styles.css';
import React, { useCallback, useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Notifications } from '@mantine/notifications';
import { theme } from '../../theme';
import '@solana/wallet-adapter-react-ui/styles.css';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export function Providers({ children }: { children: React.ReactNode }) {
  // const { autoConnect } = useAutoConnect();
  // const { networkConfiguration } = useNetworkConfiguration();
  // const networkConfiguration = 'devnet';
  // const network = networkConfiguration as WalletAdapterNetwork;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = 'http://127.0.0.1:8899';

  const wallets = useMemo(() => [new SolflareWalletAdapter(), new PhantomWalletAdapter()], []);

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
        <WalletProvider
          wallets={wallets}
          onError={onError}
          // autoConnect={autoConnect}
        >
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </MantineProvider>
  );
}
