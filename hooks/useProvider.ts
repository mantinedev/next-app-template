import { AnchorProvider } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export function useProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(
    () => new AnchorProvider(connection, wallet as any, {}),
    [connection, wallet],
  );

  return provider;
}
