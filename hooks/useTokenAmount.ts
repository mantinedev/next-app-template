import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TokenAmount } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';

export function useTokenAmount(mint?: PublicKey, owner?: PublicKey) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const account = useMemo(() => {
    const realOwner = owner || wallet.publicKey;
    if (realOwner && mint) return getAssociatedTokenAddressSync(mint, realOwner, true);
  }, [mint, owner, wallet.publicKey]);
  const [amount, setAmount] = useState<TokenAmount>();

  const fetchAmount = async () => {
    if (account && connection) {
      setAmount((await connection.getTokenAccountBalance(account)).value);
    }
  };

  useEffect(() => {
    fetchAmount();
  }, [account, connection]);

  return { amount, account, fetchAmount };
}
