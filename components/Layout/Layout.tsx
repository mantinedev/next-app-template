'use client';

import { useDisclosure } from '@mantine/hooks';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { AppShell, Burger, Button, Group, Skeleton, Stack, Text } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { shortKey } from '../../lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const modal = useWalletModal();
  const [opened, { toggle }] = useDisclosure();

  console.log(wallet, modal);

  useEffect(() => {
    if (!wallet.connected && wallet.wallet) {
      wallet.connect();
    }
  }, [wallet]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap={3}>
          <Text>Navbar</Text>
          <Skeleton h={28} mt="sm" animate={false} />
          {wallet?.publicKey ? (
            <Button variant="danger" onClick={() => wallet.disconnect()}>
              {shortKey(wallet.publicKey)}
            </Button>
          ) : (
            <Button onClick={() => modal.setVisible(true)}>Connect wallet</Button>
          )}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
