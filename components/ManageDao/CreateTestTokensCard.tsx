'use client';

import { Button, Card, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as token from '@solana/spl-token';
import { Keypair, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { useProvider } from '@/hooks/useProvider';
import { useTokens } from '../../hooks/useTokens';

export default function CreateTestTokensCard() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const provider = useProvider();
  const { tokens, setTokens } = useTokens();

  const handleCreateDao = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    const tx = new Transaction();
    const metaKeypair = Keypair.generate();
    const quoteKeypair = Keypair.generate();
    tx.add(
      token.createInitializeMint2Instruction(metaKeypair.publicKey, 9, wallet.publicKey, null),
    );
    tx.add(
      token.createInitializeMint2Instruction(quoteKeypair.publicKey, 9, wallet.publicKey, null),
    );
    tx.add(
      token.createInitializeMint2Instruction(quoteKeypair.publicKey, 9, wallet.publicKey, null),
    );
    const metaAccount = token.getAssociatedTokenAddressSync(
      metaKeypair.publicKey,
      wallet.publicKey,
    );
    const quoteAccount = token.getAssociatedTokenAddressSync(
      quoteKeypair.publicKey,
      wallet.publicKey,
    );
    tx.add(
      token.createInitializeAccount3Instruction(
        metaAccount,
        metaKeypair.publicKey,
        wallet.publicKey,
      ),
    );
    tx.add(
      token.createInitializeAccount3Instruction(
        quoteAccount,
        quoteKeypair.publicKey,
        wallet.publicKey,
      ),
    );
    tx.add(
      token.createMintToInstruction(
        metaKeypair.publicKey,
        metaAccount,
        wallet.publicKey,
        100000n * BigInt(LAMPORTS_PER_SOL),
      ),
    );
    tx.add(
      token.createMintToInstruction(
        quoteKeypair.publicKey,
        quoteAccount,
        wallet.publicKey,
        100000n * BigInt(LAMPORTS_PER_SOL),
      ),
    );

    const blockhash = await provider.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash.blockhash;
    tx.feePayer = wallet.publicKey;
    const signedTx = await wallet.signTransaction(tx);
    await connection.sendRawTransaction(signedTx.serialize());

    setTokens({
      meta: {
        publicKey: metaKeypair.publicKey,
        symbol: 'META',
        name: 'Meta',
        decimals: 9,
        tokenProgram: token.TOKEN_PROGRAM_ID,
      },
      usdc: {
        publicKey: quoteKeypair.publicKey,
        symbol: 'USDC',
        name: 'Circle USD',
        decimals: 9,
        tokenProgram: token.TOKEN_PROGRAM_ID,
      },
    });
  }, [provider, wallet, connection]);

  return (
    <Card shadow="sm" radius="md" withBorder padding="xl">
      <Card.Section>
        {tokens?.meta ? (
          <Text>Meta mint: {tokens.meta.toString()}</Text>
        ) : (
          <Text>No meta token yet</Text>
        )}
        {tokens?.usdc ? (
          <Text>Usdc mint: {tokens.usdc.toString()}</Text>
        ) : (
          <Text>No usdc token yet</Text>
        )}
      </Card.Section>
      <Card.Section>
        <Button fullWidth onClick={() => handleCreateDao()}>
          Create test tokens
        </Button>
      </Card.Section>
    </Card>
  );
}
