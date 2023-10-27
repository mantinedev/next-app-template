'use client';

import { Button, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';
import { Wallet } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Layout } from '@/components/Layout/Layout';
import { useProvider } from '@/hooks/useProvider';

export default function CreateDaoButton() {
  const wallet = useWallet();
  const provider = useProvider();

  const handleCreateDao = useCallback(async () => {
    if (!wallet.publicKey) return;
  }, []);

  return <Button onClick={() => handleCreateDao()}>Notification</Button>;
}
