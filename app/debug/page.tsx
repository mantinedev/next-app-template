'use client';

import { Button, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';
import { Wallet } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Layout } from '@/components/Layout/Layout';
import { useProvider } from '@/hooks/useProvider';
import CreateTestTokensCard from '../../components/ManageDao/CreateTestTokensCard';

export default function DebugPage() {
  const wallet = useWallet();
  const provider = useProvider();

  const handleCreateDao = useCallback(async () => {
    if (!wallet.publicKey) return;
  }, []);

  return (
    <Layout>
      <Container>
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
        <CreateTestTokensCard />
      </Container>
    </Layout>
  );
}
