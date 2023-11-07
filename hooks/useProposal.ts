import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { useAutocrat } from './useAutocrat';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '../lib/idl/openbook_v2';
import { OpenbookTwap } from '../lib/idl/openbook_twap';
import { useProvider } from './useProvider';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '../lib/constants';
import { Markets, ProposalAccount } from '../lib/types';
import { useConditionalVault } from './useConditionalVault';

const OPENBOOK_TWAP_IDL: OpenbookTwap = require('@/lib/idl/openbook_twap.json');

export function useProposal(id: number) {
  const { program } = useAutocrat();
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

  return { proposal, markets, loading, fetchProposal, mintTokens };
}
