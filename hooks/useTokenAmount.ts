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
    if (wallet && account) {
      const defaultAmount: TokenAmount = {
        amount: '0.0',
        decimals: 0.0,
        uiAmount: 0.0,
      };
      try {
        const accountTokenBalance = (await connection.getTokenAccountBalance(account)).value;
        if (accountTokenBalance.uiAmount != null) {
          setAmount(accountTokenBalance);
        } else {
          setAmount(defaultAmount);
        }
      } catch (err) {
        console.error(err);
        setAmount(defaultAmount);
      }
    }
  };

  useEffect(() => {
    fetchAmount();
  }, [account]);

  return { amount, account, fetchAmount };
}
