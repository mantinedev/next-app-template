import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

export const useWeb3 = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const closeOrderAccount = useCallback(
    async () => {
      if (!connection || !wallet.publicKey || !wallet.signAllTransactions) {
        throw new Error('Bad wallet connection');
      }

      return null;
    },
    [wallet.publicKey, connection],
  );

  return { closeOrderAccount };
};
