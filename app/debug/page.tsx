'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Layout } from '@/components/Layout/Layout';
import '@mantine/notifications/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProvider } from '@/hooks/useProvider';
import { useCallback } from 'react';
import { Wallet } from '@coral-xyz/anchor';

export default function DebugPage() {
  const wallet = useWallet();
  const provider = useProvider();

  const handleCreateDao = useCallback(async () => {
    if (!wallet.publicKey) return;

    const program;
  });
  return (
    <Layout>
      <Button
        onClick={() =>
          notifications.show({
            title: 'Test notif',
            message: 'Message',
          })
        }
      >
        Notification
      </Button>
    </Layout>
  );
}
