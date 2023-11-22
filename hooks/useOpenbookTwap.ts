import { useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AccountMeta, PublicKey, Transaction, VersionedTransaction, MessageV0 } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PlaceOrderArgs } from '@openbook-dex/openbook-v2/dist/types/client';
import { SelfTradeBehavior, OrderType, Side } from '@openbook-dex/openbook-v2/dist/cjs/utils/utils';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '@/lib/idl/openbook_v2';
import { OpenbookTwap } from '@/lib/idl/openbook_twap';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '@/lib/constants';
import { FillEvent, MarketAccountWithKey, OutEvent, ProposalAccountWithKey } from '@/lib/types';
import { shortKey } from '@/lib/utils';
import { useProvider } from '@/hooks/useProvider';
import {
  createOpenOrdersIndexerInstruction,
  createOpenOrdersInstruction,
  findOpenOrders,
  findOpenOrdersIndexer,
} from '../lib/openbook';
import { useConditionalVault } from './useConditionalVault';

const OPENBOOK_TWAP_IDL: OpenbookTwap = require('@/lib/idl/openbook_twap.json');

const SYSTEM_PROGRAM: PublicKey = new PublicKey('11111111111111111111111111111111');

export function useOpenbookTwap() {
  const wallet = useWallet();
  const provider = useProvider();
  const { getVaultMint } = useConditionalVault();
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

  const placeOrderTransactions = useCallback(
    async (
      amount: number,
      price: number,
      market: MarketAccountWithKey,
      limitOrder?: boolean,
      ask?: boolean,
      pass?: boolean,
      indexOffset?: number,
    ) => {
      if (!wallet.publicKey || !wallet.signAllTransactions || !openbook || !openbookTwap) {
        return;
      }

      const mint = ask ? market.account.baseMint : market.account.quoteMint;
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
        market.publicKey,
        accountIndex,
        `${shortKey(wallet.publicKey)}-${accountIndex.toString()}`,
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
          asks: market.account.asks,
          bids: market.account.bids,
          eventHeap: market.account.eventHeap,
          market: market.publicKey,
          marketVault: ask ? market.account.marketBaseVault : market.account.marketQuoteVault,
          twapMarket: PublicKey.findProgramAddressSync(
            [Buffer.from('twap_market'), market.publicKey.toBuffer()],
            OPENBOOK_TWAP_PROGRAM_ID,
          )[0],
          userTokenAccount: getAssociatedTokenAddressSync(mint, wallet.publicKey),
          openbookProgram: openbook.programId,
        })
        .preInstructions(openTx.instructions)
        .transaction();

      return [placeTx];
    },
    [wallet, openbookTwap],
  );

  const crankMarketTransaction = useCallback(
    async (market: MarketAccountWithKey) => {
      if (!wallet.publicKey || !wallet.signAllTransactions || !openbook || !openbookTwap) {
        return;
      }
      // pass the correct market from TWP get the market of that market.
      let accounts: PublicKey[] = new Array<PublicKey>();
      const eventHeap = await openbook.account.eventHeap.fetch(market.publicKey);
      if (eventHeap != null) {
        // eslint-disable-next-line no-restricted-syntax
        for (const node of eventHeap.nodes) {
          if (node.event.eventType === 0) {
            const fillEvent: FillEvent = openbook.coder.types.decode(
              'FillEvent',
              Buffer.from([0, ...node.event.padding]),
            );
            accounts = accounts
              .filter((a) => a !== fillEvent.maker)
              .concat([fillEvent.maker]);
          } else {
            const outEvent: OutEvent = openbook.coder.types.decode(
              'OutEvent',
              Buffer.from([0, ...node.event.padding]),
            );
            accounts = accounts
              .filter((a) => a !== outEvent.owner)
              .concat([outEvent.owner]);
          }
          // Tx would be too big, do not add more accounts
          if (accounts.length > 19) {
            break;
          }
        }
      }
      const accountsMeta: AccountMeta[] = accounts.map((remaining) => ({
        pubkey: remaining,
        isSigner: false,
        isWritable: true,
      }));
      const crankIx = await openbook.methods
        .consumeEvents(new BN(7))
        .accounts({
          consumeEventsAdmin: openbook.programId,
          // TODO: Review the market...
          market: market.publicKey,
          eventHeap: market.account.eventHeap,
        })
        .remainingAccounts(accountsMeta)
        .instruction();

      const latestBlockhash = await provider.connection.getLatestBlockhash();

      const message = MessageV0.compile({
        payerKey: provider.wallet.publicKey,
        instructions: [crankIx],
        recentBlockhash: latestBlockhash.blockhash,
        addressLookupTableAccounts: undefined,
      });

      let vtx = new VersionedTransaction(message);
      vtx = (await wallet.signTransaction(
        vtx as any,
      )) as unknown as VersionedTransaction;
      const signature = await provider.connection.sendRawTransaction(vtx.serialize(), {
        skipPreflight: true,
      });
      return signature;
    }, [wallet, openbook, provider]
  );

  const settleFundsTransactions = useCallback(
    async (
      orderId: BN,
      passMarket: boolean,
      proposal: ProposalAccountWithKey,
      market: MarketAccountWithKey,
    ) => {
      if (!wallet.publicKey || !wallet.signAllTransactions || !openbook || !openbookTwap) {
        return;
      }
      console.log(market.publicKey.toString());
      const quoteVault = await getVaultMint(proposal.account.quoteVault);
      const baseVault = await getVaultMint(proposal.account.baseVault);
      const openOrdersAccount = findOpenOrders(orderId, wallet.publicKey);
      // TODO: Determine if order is on pass or fail market?
      const userBasePass = getAssociatedTokenAddressSync(
        baseVault.conditionalOnFinalizeTokenMint,
        wallet.publicKey,
      );
      const userQuotePass = getAssociatedTokenAddressSync(
        quoteVault.conditionalOnFinalizeTokenMint,
        wallet.publicKey,
      );
      const userBaseFail = getAssociatedTokenAddressSync(
        baseVault.conditionalOnRevertTokenMint,
        wallet.publicKey,
      );
      const userQuoteFail = getAssociatedTokenAddressSync(
        quoteVault.conditionalOnRevertTokenMint,
        wallet.publicKey,
      );
      let userBaseAccount = userBaseFail;
      let userQuoteAccount = userQuoteFail;
      if (passMarket) {
        userBaseAccount = userBasePass;
        userQuoteAccount = userQuotePass;
      }
      // TODO: 2x Txns for each side..
      const placeTx = await openbook.methods
        .settleFunds()
        .accounts({
          owner: wallet.publicKey,
          penaltyPayer: wallet.publicKey,
          openOrdersAccount,
          market: market.publicKey,
          marketAuthority: market.account.marketAuthority,
          marketBaseVault: market.account.marketBaseVault,
          marketQuoteVault: market.account.marketQuoteVault,
          userBaseAccount,
          userQuoteAccount,
          referrerAccount: null,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM,
        })
        .transaction();
      return [placeTx];
    },
    [wallet, openbook, openbookTwap],
  );

  const cancelOrderTransactions = useCallback(
    async (orderId: BN, market: MarketAccountWithKey) => {
      if (!wallet.publicKey || !wallet.signAllTransactions || !openbook || !openbookTwap) {
        return;
      }

      // const baseLot = 1;
      console.log(orderId.toString());
      const openOrdersAccount = findOpenOrders(orderId, wallet.publicKey);
      const placeTx = await openbookTwap.methods
        .cancelOrderByClientId(orderId)
        .accounts({
          openOrdersAccount,
          asks: market.account.asks,
          bids: market.account.bids,
          market: market.publicKey,
          twapMarket: PublicKey.findProgramAddressSync(
            [Buffer.from('twap_market'), market.publicKey.toBuffer()],
            OPENBOOK_TWAP_PROGRAM_ID,
          )[0],
          openbookProgram: openbook.programId,
        })
        .transaction();

      return [placeTx];
    },
    [wallet, openbook, openbookTwap],
  );

  return {
    placeOrderTransactions,
    cancelOrderTransactions,
    settleFundsTransactions,
    crankMarketTransaction,
    program: openbookTwap,
  };
}
