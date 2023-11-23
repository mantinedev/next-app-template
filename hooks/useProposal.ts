import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { notifications } from '@mantine/notifications';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '@/lib/idl/openbook_v2';
import { OPENBOOK_PROGRAM_ID } from '@/lib/constants';
import { OpenOrdersAccountWithKey, ProposalAccountWithKey } from '@/lib/types';
import { useAutocrat } from '@/contexts/AutocratContext';
import { useProvider } from '@/hooks/useProvider';
import { useConditionalVault } from '@/hooks/useConditionalVault';
import { useOpenbookTwap } from './useOpenbookTwap';

export function useProposal({
  fromNumber,
  fromProposal,
}: {
  fromNumber?: number | undefined;
  fromProposal?: ProposalAccountWithKey;
}) {
  const { proposals, allMarketsInfo, fetchMarketsInfo } = useAutocrat();
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useProvider();
  const openbook = useMemo(() => {
    if (!provider) {
      return;
    }
    return new Program<OpenbookV2>(OPENBOOK_IDL, OPENBOOK_PROGRAM_ID, provider);
  }, [provider]);
  const { placeOrderTransactions } = useOpenbookTwap();
  const { mintConditionalTokens, getVaultMint, createConditionalTokensAccounts } =
    useConditionalVault();
  const [orders, setOrders] = useState<OpenOrdersAccountWithKey[]>();
  const [loading, setLoading] = useState(false);
  const [metaDisabled, setMetaDisabled] = useState(false);
  const [usdcDisabled, setUsdcDisabled] = useState(false);
  const proposal = useMemo<ProposalAccountWithKey | undefined>(
    () =>
      proposals?.filter(
        (t) =>
          t.account.number === fromNumber ||
          t.publicKey.toString() === fromProposal?.publicKey.toString(),
      )[0],
    [proposals, fromProposal],
  );
  const markets = proposal ? allMarketsInfo[proposal.publicKey.toString()] : undefined;

  const fetchOpenOrders = useCallback(async () => {
    if (!proposal || !openbook || !wallet.publicKey) {
      return;
    }
    const passOrders = await openbook.account.openOrdersAccount.all([
      { memcmp: { offset: 8, bytes: wallet.publicKey.toBase58() } },
      { memcmp: { offset: 40, bytes: proposal.account.openbookPassMarket.toBase58() } },
    ]);
    const failOrders = await openbook.account.openOrdersAccount.all([
      { memcmp: { offset: 8, bytes: wallet.publicKey.toBase58() } },
      { memcmp: { offset: 40, bytes: proposal.account.openbookFailMarket.toBase58() } },
    ]);
    setOrders(
      passOrders
        .concat(failOrders)
        .sort((a, b) => (a.account.accountNum < b.account.accountNum ? 1 : -1)),
    );
  }, [openbook, proposal]);

  useEffect(() => {
    if (!orders) {
      fetchOpenOrders();
    }
  }, [orders, markets, fetchOpenOrders]);

  useEffect(() => {
    if (!markets && proposal) {
      fetchMarketsInfo(proposal);
    }
  }, [markets, fetchMarketsInfo]);

  const createTokenAccountsTransactions = useCallback(
    async (fromBase?: boolean) => {
      if (!proposal || !markets) {
        return;
      }
      const createAccounts = await createConditionalTokensAccounts(
        proposal.account,
        fromBase ? markets.baseVault : markets.quoteVault,
        fromBase,
      );
      const tx = new Transaction().add(...(createAccounts?.ixs ?? []));

      return [tx];
    },
    [proposal, markets],
  );

  const createTokenAccounts = useCallback(
    async (fromBase?: boolean) => {
      const txs = await createTokenAccountsTransactions(fromBase);
      if (!txs || !proposal || !wallet.publicKey || !wallet.signAllTransactions) {
        return;
      }
      let error = false;
      let metaBalance = null;
      const metaMint = new PublicKey('METADDFL6wWMWEoKTFJwcThTbUmtarRJZjRpzUvkxhr');
      const quoteVault = await getVaultMint(proposal.account.quoteVault);
      const baseVault = await getVaultMint(proposal.account.baseVault);
      const userBasePass = getAssociatedTokenAddressSync(
        baseVault.conditionalOnFinalizeTokenMint,
        wallet.publicKey,
      );
      const userQuotePass = getAssociatedTokenAddressSync(
        quoteVault.conditionalOnFinalizeTokenMint,
        wallet.publicKey,
      );
      const metaTokenAccount = getAssociatedTokenAddressSync(metaMint, wallet.publicKey, false);

      try {
        metaBalance = await connection.getTokenAccountBalance(metaTokenAccount);
      } catch (err) {
        console.log('unable to fetch balance for META token account');
      }
      try {
        if (fromBase) {
          await connection.getTokenAccountBalance(userBasePass);
        } else {
          await connection.getTokenAccountBalance(userQuotePass);
        }
      } catch (err) {
        error = true;
        console.log("turns out the account doesn't exist we can create it");
      }
      if (!error) {
        notifications.show({
          title: 'Token Accounts Exist',
          message: "You won't need to press this button again.",
          autoClose: 5000,
        });
        if (fromBase) {
          setMetaDisabled(true);
        } else {
          setUsdcDisabled(true);
        }
      }

      if (error) {
        if (metaBalance === null) {
          const tx = new Transaction();
          tx.add(
            createAssociatedTokenAccountInstruction(
              wallet.publicKey, // payer
              metaTokenAccount, // ata
              wallet.publicKey, // owner
              metaMint, // mint
            ),
          );
          txs.unshift(tx);
        }
        setLoading(true);

        try {
          const { blockhash } = await connection.getLatestBlockhash();
          const signedTxs = await wallet.signAllTransactions(
            txs.map((t) => {
              const tx = t;
              tx.recentBlockhash = blockhash;
              tx.feePayer = wallet.publicKey!;
              return tx;
            }),
          );
          const results = await Promise.all(
            signedTxs.map((t) =>
              connection.sendRawTransaction(t.serialize(), { skipPreflight: true }),
            ),
          );
          results.map((result) =>
            notifications.show({
              title: 'Transaction Submitted',
              message: result,
              autoClose: 5000,
            }),
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [wallet, connection, createTokenAccountsTransactions],
  );

  const mintTokensTransactions = useCallback(
    async (amount: number, fromBase?: boolean) => {
      if (!proposal || !markets) {
        return;
      }

      const mint = await mintConditionalTokens(
        amount,
        proposal.account,
        fromBase ? markets.baseVault : markets.quoteVault,
        fromBase,
      );
      const tx = new Transaction().add(...(mint?.ixs ?? []));

      return [tx];
    },
    [proposal, markets],
  );

  const mintTokens = useCallback(
    async (amount: number, fromBase?: boolean) => {
      const txs = await mintTokensTransactions(amount, fromBase);
      if (!txs || !proposal || !wallet.publicKey || !wallet.signAllTransactions) {
        return;
      }

      setLoading(true);

      try {
        const { blockhash } = await connection.getLatestBlockhash();
        const signedTxs = await wallet.signAllTransactions(
          txs.map((t) => {
            const tx = t;
            tx.recentBlockhash = blockhash;
            tx.feePayer = wallet.publicKey!;
            return tx;
          }),
        );
        const results = await Promise.all(
          signedTxs.map((t) =>
            connection.sendRawTransaction(t.serialize(), { skipPreflight: true }),
          ),
        );
        results.map((result) =>
          notifications.show({
            title: 'Transaction Submitted',
            message: result,
            autoClose: 5000,
          }),
        );

        await fetchMarketsInfo(proposal);
      } finally {
        setLoading(false);
      }
    },
    [wallet, connection, mintTokensTransactions],
  );

  const placeOrder = useCallback(
    async (amount: number, price: number, limitOrder?: boolean, ask?: boolean, pass?: boolean) => {
      if (!proposal || !markets) return;
      const market = pass
        ? { publicKey: proposal?.account.openbookPassMarket, account: markets?.pass }
        : { publicKey: proposal?.account.openbookFailMarket, account: markets?.fail };
      const placeTxs = await placeOrderTransactions(amount, price, market, limitOrder, ask, pass);

      if (!placeTxs || !wallet.publicKey || !wallet.signAllTransactions) {
        return;
      }

      try {
        setLoading(true);

        const blockhask = await connection.getLatestBlockhash();
        const txs = placeTxs.map((e: Transaction) => {
          const tx = e;
          tx.recentBlockhash = blockhask.blockhash;
          tx.feePayer = wallet.publicKey!;
          return tx;
        });
        const txSignatures = [];
        const signedTxs = await wallet.signAllTransactions(txs);
        // Using loops here to make sure transaction are executed in the correct order
        // eslint-disable-next-line no-restricted-syntax
        for (const tx of signedTxs) {
          // eslint-disable-next-line no-await-in-loop
          const txnSignature = await connection.sendRawTransaction(tx.serialize(), {
            skipPreflight: true,
          });
          // eslint-disable-next-line no-await-in-loop
          await connection.confirmTransaction(txnSignature);
          txSignatures.push(txnSignature);
        }
        txSignatures?.map((result) =>
          notifications.show({
            title: 'Transaction Submitted',
            message: result,
            autoClose: 5000,
          }),
        );
        await fetchMarketsInfo(proposal);
        await fetchOpenOrders();
      } finally {
        setLoading(false);
      }
    },
    [wallet, proposal, markets, connection, placeOrderTransactions],
  );

  return {
    proposal,
    markets,
    orders,
    loading,
    metaDisabled,
    usdcDisabled,
    fetchOpenOrders,
    createTokenAccounts,
    createTokenAccountsTransactions,
    mintTokensTransactions,
    mintTokens,
    placeOrderTransactions,
    placeOrder,
  };
}
