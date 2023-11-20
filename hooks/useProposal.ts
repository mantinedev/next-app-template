import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
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
  const { program: vaultProgram, mintConditionalTokens } = useConditionalVault();
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
  const fetchOrders = useCallback(async () => {
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
      fetchOrders();
    }
  }, [orders, markets, fetchOrders]);

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
    const failBids = getLeafNodes(
      await openbook.coder.accounts.decode('bookSide', bookAccountInfos[2]!.data),
      openbook,
    );
    const failAsks = getLeafNodes(
      await openbook.coder.accounts.decode('bookSide', bookAccountInfos[3]!.data),
      openbook,
    );

    const [passBid, passAsk] = await openbookTwap.views.getBestBidAndAsk({
      accounts: {
        market: proposal.account.openbookPassMarket,
        bids: pass.bids,
        asks: pass.asks,
      },
    });
    const [failBid, failAsk] = await openbookTwap.views.getBestBidAndAsk({
      accounts: {
        market: proposal.account.openbookFailMarket,
        bids: fail.bids,
        asks: fail.asks,
      },
    });
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
        await fetchOrders();
      } finally {
        setLoading(false);
      }
    },
    [wallet, connection, placeOrderTransactions],
  );

  return {
    proposal,
    markets,
    orders,
    loading,
    fetchOrders,
    fetchMarkets,
    mintTokensTransactions,
    mintTokens,
    placeOrderTransactions,
    placeOrder,
  };
}
