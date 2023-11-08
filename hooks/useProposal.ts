import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PlaceOrderArgs } from '@openbook-dex/openbook-v2/dist/types/client';
import { SelfTradeBehavior, OrderType, Side } from '@openbook-dex/openbook-v2/dist/cjs/utils/utils';
import numeral from 'numeral';
import { useAutocrat } from './useAutocrat';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '../lib/idl/openbook_v2';
import { OpenbookTwap } from '../lib/idl/openbook_twap';
import { useProvider } from './useProvider';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '../lib/constants';
import { Markets, ProposalAccount } from '../lib/types';
import { useConditionalVault } from './useConditionalVault';
import { shortKey } from '../lib/utils';
import { useTokens } from './useTokens';

const OPENBOOK_TWAP_IDL: OpenbookTwap = require('@/lib/idl/openbook_twap.json');

const findOpenOrdersIndexer = (owner: PublicKey): PublicKey => {
  const [openOrdersIndexer] = PublicKey.findProgramAddressSync(
    [Buffer.from('OpenOrdersIndexer'), owner.toBuffer()],
    OPENBOOK_PROGRAM_ID,
  );
  return openOrdersIndexer;
};

const createOpenOrdersIndexerInstruction = async (
  program: Program<OpenbookV2>,
  openOrdersIndexer: PublicKey,
  owner: PublicKey,
): Promise<TransactionInstruction> =>
  program.methods
    .createOpenOrdersIndexer()
    .accounts({
      openOrdersIndexer,
      owner,
      payer: owner,
    })
    .instruction();

const findOpenOrders = (accountIndex: BN, owner: PublicKey): PublicKey => {
  const [openOrders] = PublicKey.findProgramAddressSync(
    [Buffer.from('OpenOrders'), owner.toBuffer(), accountIndex.toArrayLike(Buffer, 'le', 4)],
    OPENBOOK_PROGRAM_ID,
  );
  return openOrders;
};

const createOpenOrdersInstruction = async (
  program: Program<OpenbookV2>,
  market: PublicKey,
  accountIndex: BN,
  name: string,
  owner: PublicKey,
  openOrdersIndexer: PublicKey,
): Promise<[TransactionInstruction[], PublicKey]> => {
  const ixs: TransactionInstruction[] = [];

  if (accountIndex.toNumber() === 0) {
    throw Object.assign(new Error('accountIndex can not be 0'), {
      code: 403,
    });
  }
  const openOrdersAccount = findOpenOrders(accountIndex, owner);

  ixs.push(
    await program.methods
      .createOpenOrdersAccount(name)
      .accounts({
        openOrdersIndexer,
        openOrdersAccount,
        market,
        owner,
        delegateAccount: null,
      })
      .instruction(),
  );

  return [ixs, openOrdersAccount];
};

export function useProposal(id: number) {
  const { program } = useAutocrat();
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useProvider();
  const { tokens } = useTokens();
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
  const [proposal, setProposal] = useState<{ account: ProposalAccount; publicKey: PublicKey }>();
  const [loading, setLoading] = useState(false);

  const fetchProposal = useCallback(async () => {
    setProposal((await program.account.proposal.all()).filter((t) => t.account.number === id)[0]);
  }, [program]);

  const fetchMarkets = useCallback(async () => {
    if (!proposal || !openbook || !openbookTwap || !openbookTwap.views) return;

    setLoading(true);

    const pass = await openbook.account.market.fetch(proposal.account.openbookPassMarket);
    const fail = await openbook.account.market.fetch(proposal.account.openbookFailMarket);
    const passTwap = await openbookTwap.account.twapMarket.fetch(
      proposal.account.openbookTwapPassMarket,
    );
    const failTwap = await openbookTwap.account.twapMarket.fetch(
      proposal.account.openbookTwapFailMarket,
    );
    const baseVault = await vaultProgram.account.conditionalVault.fetch(proposal.account.baseVault);
    const quoteVault = await vaultProgram.account.conditionalVault.fetch(
      proposal.account.quoteVault,
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
    setMarkets({
      pass,
      fail,
      passTwap,
      failTwap,
      passPrice: {
        bid: passBid,
        ask: passAsk,
      },
      failPrice: {
        bid: failBid,
        ask: failAsk,
      },
      baseVault,
      quoteVault,
    });

    setLoading(false);
  }, [vaultProgram, openbook, openbookTwap]);

  useEffect(() => {
    if (!proposal) {
      fetchProposal();
    }
  }, [proposal, fetchProposal]);

  useEffect(() => {
    if (!markets) {
      fetchMarkets();
    }
  }, [markets, fetchMarkets]);

  const mintTokens = useCallback(
    async (amount: number, fromBase?: boolean) => {
      if (!proposal || !markets || !wallet.publicKey || !wallet.signAllTransactions) {
        return;
      }

      setLoading(true);

      const mint = await mintConditionalTokens(
        amount,
        proposal.account,
        fromBase ? markets.baseVault : markets.quoteVault,
        fromBase,
      );
      const tx = new Transaction().add(...(mint?.ixs ?? []));

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      const signedTxs = await wallet.signAllTransactions([tx]);
      await Promise.all(
        signedTxs.map((t) => connection.sendRawTransaction(t.serialize(), { skipPreflight: true })),
      );

      await fetchMarkets();

      setLoading(false);
    },
    [wallet, proposal, markets, connection],
  );

  const placeOrder = useCallback(
    async (amount: number, price: number, ask?: boolean, pass?: boolean) => {
      if (
        !proposal ||
        !markets ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !openbook ||
        !openbookTwap ||
        !tokens?.meta ||
        !tokens?.usdc
      ) {
        return;
      }

      try {
        setLoading(true);

        const market = pass ? markets.pass : markets.fail;
        const mint = ask ? market.baseMint : market.quoteMint;
        const openTx = new Transaction();
        const openOrdersIndexer = findOpenOrdersIndexer(wallet.publicKey);
        let accountIndex = new BN(1);
        try {
          const indexer = await openbook.account.openOrdersIndexer.fetch(openOrdersIndexer);
          console.log(indexer);
          if (indexer == null) {
            openTx.add(
              await createOpenOrdersIndexerInstruction(
                openbook,
                openOrdersIndexer,
                wallet.publicKey,
              ),
            );
          } else {
            accountIndex = new BN(indexer.createdCounter + 1);
          }
        } catch {
          openTx.add(
            await createOpenOrdersIndexerInstruction(openbook, openOrdersIndexer, wallet.publicKey),
          );
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

        const args: PlaceOrderArgs = {
          side: ask ? Side.Ask : Side.Bid,
          priceLots: new BN(
            numeral(price)
              .multiply(10 ** (ask ? tokens.meta.decimals : tokens.usdc.decimals))
              .format('0'),
          ),
          maxBaseLots: new BN(amount),
          maxQuoteLotsIncludingFees: new BN(
            numeral(amount)
              .multiply(price)
              .multiply(10 ** (ask ? tokens.meta.decimals : tokens.usdc.decimals))
              .format('0'),
          ),
          clientOrderId: accountIndex,
          orderType: OrderType.Limit,
          expiryTimestamp: new BN(0),
          selfTradeBehavior: SelfTradeBehavior.DecrementTake,
          limit: 255,
        };
        console.log(Object.entries(args).map(([k, v]) => [k, v.toString()]));
        await openbookTwap.methods
          .placeOrder(args)
          .accounts({
            openOrdersAccount,
            asks: market.asks,
            bids: market.bids,
            eventHeap: market.eventHeap,
            market: pass
              ? proposal.account.openbookPassMarket
              : proposal.account.openbookFailMarket,
            marketVault: ask ? market.marketBaseVault : market.marketQuoteVault,
            twapMarket: pass
              ? proposal.account.openbookTwapPassMarket
              : proposal.account.openbookTwapFailMarket,
            userTokenAccount: getAssociatedTokenAddressSync(mint, wallet.publicKey),
            openbookProgram: openbook.programId,
          })
          .preInstructions(ixs)
          .rpc({ skipPreflight: true });

        // const { blockhash } = await connection.getLatestBlockhash();
        // openTx.recentBlockhash = blockhash;
        // placeTx.feePayer = wallet.publicKey;

        // const signedTxs = await wallet.signAllTransactions([tx]);
        // await Promise.all(
        //   signedTxs.map((t) => connection.sendRawTransaction(t.serialize(), { skipPreflight: true })),
        // );

        await fetchMarkets();
      } finally {
        setLoading(false);
      }
    },
    [wallet, proposal, markets, connection, openbookTwap, tokens],
  );

  return { proposal, markets, loading, fetchProposal, mintTokens, placeOrder };
}
