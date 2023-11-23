import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '@/lib/idl/openbook_v2';
import { OPENBOOK_PROGRAM_ID } from '@/lib/constants';
import { Markets, OpenOrdersAccountWithKey, ProposalAccountWithKey } from '@/lib/types';
import { useAutocrat } from '@/contexts/AutocratContext';
import { useProvider } from '@/hooks/useProvider';
import { useConditionalVault } from '@/hooks/useConditionalVault';
import { useOpenbookTwap } from './useOpenbookTwap';
import { getLeafNodes } from '../lib/openbook';

export function useProposal({
  fromNumber,
  fromProposal,
}: {
  fromNumber?: number | undefined;
  fromProposal?: ProposalAccountWithKey;
}) {
  const { proposals } = useAutocrat();
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useProvider();
  const openbook = useMemo(() => {
    if (!provider) {
      return;
    }
    return new Program<OpenbookV2>(OPENBOOK_IDL, OPENBOOK_PROGRAM_ID, provider);
  }, [provider]);
  const { placeOrderTransactions, program: openbookTwap } = useOpenbookTwap();
  const {
    program: vaultProgram,
    mintConditionalTokens,
    getVaultMint,
    createConditionalTokensAccounts,
  } = useConditionalVault();
  const [markets, setMarkets] = useState<Markets>();
  const [orders, setOrders] = useState<OpenOrdersAccountWithKey[]>();
  const [loading, setLoading] = useState(false);
  const proposal = useMemo<ProposalAccountWithKey | undefined>(
    () =>
      proposals?.filter(
        (t) =>
          t.account.number === fromNumber ||
          t.publicKey.toString() === fromProposal?.publicKey.toString(),
      )[0],
    [proposals, fromProposal],
  );

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

  const fetchMarkets = useCallback(async () => {
    if (!wallet.publicKey || !proposal || !openbook || !openbookTwap || !openbookTwap.views) return;

    const accountInfos = await connection.getMultipleAccountsInfo([
      proposal.account.openbookPassMarket,
      proposal.account.openbookFailMarket,
      proposal.account.openbookTwapPassMarket,
      proposal.account.openbookTwapFailMarket,
      proposal.account.baseVault,
      proposal.account.quoteVault,
    ]);
    if (!accountInfos || accountInfos.indexOf(null) >= 0) return;

    const pass = await openbook.coder.accounts.decode('market', accountInfos[0]!.data);
    const fail = await openbook.coder.accounts.decode('market', accountInfos[1]!.data);
    const passTwap = await openbookTwap.coder.accounts.decodeUnchecked(
      'TWAPMarket',
      accountInfos[2]!.data,
    );
    const failTwap = await openbookTwap.coder.accounts.decodeUnchecked(
      'TWAPMarket',
      accountInfos[3]!.data,
    );
    const baseVault = await vaultProgram.coder.accounts.decode(
      'conditionalVault',
      accountInfos[4]!.data,
    );
    const quoteVault = await vaultProgram.coder.accounts.decode(
      'conditionalVault',
      accountInfos[5]!.data,
    );

    const bookAccountInfos = await connection.getMultipleAccountsInfo([
      pass.asks,
      pass.bids,
      fail.asks,
      fail.bids,
    ]);
    const passAsks = getLeafNodes(
      await openbook.coder.accounts.decode('bookSide', bookAccountInfos[0]!.data),
      openbook,
    );
    const passBids = getLeafNodes(
      await openbook.coder.accounts.decode('bookSide', bookAccountInfos[1]!.data),
      openbook,
    );
    const failAsks = getLeafNodes(
      await openbook.coder.accounts.decode('bookSide', bookAccountInfos[2]!.data),
      openbook,
    );
    const failBids = getLeafNodes(
      await openbook.coder.accounts.decode('bookSide', bookAccountInfos[3]!.data),
      openbook,
    );

    const prices: BN[] = [];
    try {
      prices.push(
        ...(await openbookTwap.views.getBestBidAndAsk({
          accounts: {
            market: proposal.account.openbookPassMarket,
            bids: pass.bids,
            asks: pass.asks,
          },
        })),
      );
      prices.push(
        ...(await openbookTwap.views.getBestBidAndAsk({
          accounts: {
            market: proposal.account.openbookFailMarket,
            bids: fail.bids,
            asks: fail.asks,
          },
        })),
      );
    } catch (err) {
      /// Get mid prices failed, do not update prices yet
      return;
    }

    const [passBid, passAsk, failBid, failAsk] = prices;
    const quoteLot = 0.0001;
    setMarkets({
      pass,
      passAsks,
      passBids,
      fail,
      failAsks,
      failBids,
      passTwap,
      failTwap,
      passPrice: {
        bid: passBid.toNumber() * quoteLot,
        ask: passAsk.toNumber() * quoteLot,
      },
      failPrice: {
        bid: failBid.toNumber() * quoteLot,
        ask: failAsk.toNumber() * quoteLot,
      },
      baseVault,
      quoteVault,
    });
  }, [vaultProgram, openbook, openbookTwap]);

  useEffect(() => {
    if (!markets) {
      fetchMarkets();
    }
  }, [markets, fetchMarkets]);

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
    }, [proposal, markets]

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
      const metaTokenAccount = getAssociatedTokenAddressSync(
        metaMint,
        wallet.publicKey,
        false
      );

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
        console.log('turns out the account doesn\'t exist we can create it');
      }

      if (error) {
        if (metaBalance === null) {
          const tx = new Transaction();
          tx.add(
            createAssociatedTokenAccountInstruction(
              wallet.publicKey, // payer
              metaTokenAccount, // ata
              wallet.publicKey, // owner
              metaMint // mint
            )
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
          await Promise.all(
            signedTxs.map((t) =>
              connection.sendRawTransaction(t.serialize(), { skipPreflight: true }),
            ),
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
        await Promise.all(
          signedTxs.map((t) =>
            connection.sendRawTransaction(t.serialize(), { skipPreflight: true }),
          ),
        );

        await fetchMarkets();
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
        const signedTxs = await wallet.signAllTransactions(txs);
        // Using loops here to make sure transaction are executed in the correct order
        // eslint-disable-next-line no-restricted-syntax
        for (const tx of signedTxs) {
          // eslint-disable-next-line no-await-in-loop
          await connection.confirmTransaction(
            // eslint-disable-next-line no-await-in-loop
            await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true }),
          );
        }

        await fetchMarkets();
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
    fetchOpenOrders,
    fetchMarkets,
    createTokenAccounts,
    createTokenAccountsTransactions,
    mintTokensTransactions,
    mintTokens,
    placeOrderTransactions,
    placeOrder,
  };
}
