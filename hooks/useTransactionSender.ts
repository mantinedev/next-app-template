import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { useCallback } from 'react';

export const useTransactionSender = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const send = useCallback(
    async (txs: Transaction[]) => {
      if (!connection || !wallet.publicKey || !wallet.signAllTransactions) {
        throw new Error('Bad wallet connection');
      }

      const blockhask = await connection.getLatestBlockhash();
      const timedTxs = txs.map((e: Transaction) => {
        const tx = e;
        tx.recentBlockhash = blockhask.blockhash;
        tx.feePayer = wallet.publicKey!;
        return tx;
      });
      const signedTxs = await wallet.signAllTransactions(timedTxs);
      const signatures = [];
      // Using loops here to make sure transaction are executed in the correct order
      // eslint-disable-next-line no-restricted-syntax
      for (const tx of signedTxs) {
        // eslint-disable-next-line no-await-in-loop
        const txSignature = await connection.sendRawTransaction(
          tx.serialize(),
          { skipPreflight: true }
        );
        // eslint-disable-next-line no-await-in-loop
        await connection.confirmTransaction(
          txSignature
        );
        signatures.push(txSignature);
      }
      return signatures;
    },
    [wallet.publicKey, connection],
  );

  return { send };
};
