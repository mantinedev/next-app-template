import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PlaceOrderArgs } from '@openbook-dex/openbook-v2/dist/types/client';
import { SelfTradeBehavior, OrderType, Side } from '@openbook-dex/openbook-v2/dist/cjs/utils/utils';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '@/lib/idl/openbook_v2';
import { OpenbookTwap } from '@/lib/idl/openbook_twap';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '@/lib/constants';
import { Markets, ProposalAccountWithKey } from '@/lib/types';
import { shortKey } from '@/lib/utils';
import { useAutocrat } from '@/contexts/AutocratContext';
import { useProvider } from '@/hooks/useProvider';
import { useConditionalVault } from '@/hooks/useConditionalVault';
import {
  createOpenOrdersIndexerInstruction,
  createOpenOrdersInstruction,
  findOpenOrdersIndexer,
} from '../lib/openbook';

const OPENBOOK_TWAP_IDL: OpenbookTwap = require('@/lib/idl/openbook_twap.json');

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
  const openbookTwap = useMemo(() => {
    if (!provider) {
      return;
    }
    return new Program<OpenbookTwap>(OPENBOOK_TWAP_IDL, OPENBOOK_TWAP_PROGRAM_ID, provider);
  }, [provider]);
  const { program: vaultProgram, mintConditionalTokens } = useConditionalVault();
  const [markets, setMarkets] = useState<Markets>();
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

  const fetchMarkets = useCallback(async () => {
    if (!proposal || !openbook || !openbookTwap || !openbookTwap.views) return;

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
      fail,
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

  const placeOrderTransactions = useCallback(
    async (
      amount: number,
      price: number,
      limitOrder?: boolean,
      ask?: boolean,
      pass?: boolean,
      indexOffset?: number,
    ) => {
      if (
        !proposal ||
        !markets ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !openbook ||
        !openbookTwap
      ) {
        return;
      }

      const market = pass ? markets.pass : markets.fail;
      const mint = ask ? market.baseMint : market.quoteMint;
      const openTx = new Transaction();
      const openOrdersIndexer = findOpenOrdersIndexer(wallet.publicKey);
      let accountIndex = new BN(1);
      try {
        const indexer = await openbook.account.openOrdersIndexer.fetch(openOrdersIndexer);
        accountIndex = new BN((indexer?.createdCounter || 0) + 1 + (indexOffset || 0));
      } catch {
        if (!indexOffset) {
          openTx.add(
            await createOpenOrdersIndexerInstruction(openbook, openOrdersIndexer, wallet.publicKey),
          );
        } else {
          accountIndex = new BN(1 + (indexOffset || 0));
        }
      }
      const [ixs, openOrdersAccount] = await createOpenOrdersInstruction(
        openbook,
        pass ? proposal.account.openbookPassMarket : proposal.account.openbookFailMarket,
        accountIndex,
        `${shortKey(wallet.publicKey)}-${proposal.account.number}-${accountIndex.toString()}`,
        wallet.publicKey,
        openOrdersIndexer,
      );
      openTx.add(...ixs);

      // const baseLot = 1;
      const quoteLot = 0.0001;
      const priceLots = new BN(Math.floor(price / quoteLot));
      const maxBaseLots = new BN(Math.floor(amount));
      const args: PlaceOrderArgs = {
        side: ask ? Side.Ask : Side.Bid,
        priceLots,
        maxBaseLots,
        maxQuoteLotsIncludingFees: priceLots.mul(maxBaseLots),
        clientOrderId: accountIndex,
        orderType: limitOrder ? OrderType.Limit : OrderType.Market,
        expiryTimestamp: new BN(0),
        selfTradeBehavior: SelfTradeBehavior.AbortTransaction,
        limit: 255,
      };
      const placeTx = await openbookTwap.methods
        .placeOrder(args)
        .accounts({
          openOrdersAccount,
          asks: market.asks,
          bids: market.bids,
          eventHeap: market.eventHeap,
          market: pass ? proposal.account.openbookPassMarket : proposal.account.openbookFailMarket,
          marketVault: ask ? market.marketBaseVault : market.marketQuoteVault,
          twapMarket: pass
            ? proposal.account.openbookTwapPassMarket
            : proposal.account.openbookTwapFailMarket,
          userTokenAccount: getAssociatedTokenAddressSync(mint, wallet.publicKey),
          openbookProgram: openbook.programId,
        })
        .preInstructions(openTx.instructions)
        .transaction();

      return [placeTx];
    },
    [wallet, proposal, markets, openbookTwap],
  );

  const placeOrder = useCallback(
    async (amount: number, price: number, limitOrder?: boolean, ask?: boolean, pass?: boolean) => {
      const placeTxs = await placeOrderTransactions(amount, price, limitOrder, ask, pass);

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
      } finally {
        setLoading(false);
      }
    },
    [wallet, connection, placeOrderTransactions],
  );

  return {
    proposal,
    markets,
    loading,
    fetchMarkets,
    mintTokensTransactions,
    mintTokens,
    placeOrderTransactions,
    placeOrder,
  };
}
