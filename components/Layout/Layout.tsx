'use client';

import { useDisclosure } from '@mantine/hooks';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { AppShell, Burger, Button, Group, Stack, Text } from '@mantine/core';
import { IconMicroscope } from '@tabler/icons-react';
import { useWallet } from '@solana/wallet-adapter-react';
import '@mantine/notifications/styles.css';
import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { shortKey } from '../../lib/utils';

interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
}
const menuItems: MenuItem[] = [{ name: 'Debug', href: '/debug', icon: <IconMicroscope /> }];

export function Layout({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const modal = useWalletModal();
  const [opened, { toggle }] = useDisclosure();

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
        <Stack gap={15}>
          <Stack>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Group>
                  {item.icon}
                  <Text>{item.name}</Text>
                </Group>
              </Link>
            ))}
          </Stack>
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
