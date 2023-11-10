import { Mint, getMint } from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export function useTokenMint(mintKey?: PublicKey) {
  const { connection } = useConnection();
  const [mint, setAmount] = useState<Mint>();

  const fetchMint = async () => {
    if (mintKey && connection) {
      setAmount(await getMint(connection, mintKey));
    }
  };

  useEffect(() => {
    fetchMint();
  }, [mintKey]);

  return { mint, fetchMint };
}
