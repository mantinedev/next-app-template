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
    if (account && connection && wallet) {
      const defaultAmount: TokenAmount = {
        amount: '0.0',
        decimals: 0.0,
        uiAmount: 0.0,
      };
      try {
        setAmount((await connection.getTokenAccountBalance(account)).value);
      } catch (err) {
        console.error(
          `Error with this account fetch ${account.toString()}, please review issue and solve.`,
        );
        setAmount(defaultAmount);
      }
    }
  };

  useEffect(() => {
    fetchAmount();
  }, [account, connection, wallet]);

  return { amount, account, fetchAmount };
}
