import { useCallback, useEffect, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { IdlAccounts, Program } from '@coral-xyz/anchor';
import { useAutocrat } from './useAutocrat';
import { AutocratV0 } from '../lib/idl/autocrat_v0';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '../lib/idl/openbook_v2';
import { OpenbookTwap } from '../lib/idl/openbook_twap';
import { useProvider } from './useProvider';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '../lib/constants';

const OPENBOOK_TWAP_IDL: OpenbookTwap = require('@/lib/idl/openbook_twap.json');

export type ProposalAccount = IdlAccounts<AutocratV0>['proposal'];
export type MarketAccount = IdlAccounts<OpenbookV2>['market'];
export type TwapMarketAccount = IdlAccounts<OpenbookTwap>['twapMarket'];
export type Markets = {
  pass: MarketAccount;
  fail: MarketAccount;
  passTwap: TwapMarketAccount;
  failTwap: TwapMarketAccount;
};

export function useProposal(id: number) {
  const { program } = useAutocrat();
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
  const [markets, setMarkets] = useState<Markets>();
  const [proposal, setProposal] = useState<{ account: ProposalAccount; publicKey: PublicKey }>();

  const fetchProposal = useCallback(async () => {
    setProposal((await program.account.proposal.all()).filter((t) => t.account.number === id)[0]);
  }, [program]);

  const fetchMarkets = useCallback(async () => {
    console.log('market', proposal, openbook, openbookTwap);
    if (!proposal || !openbook || !openbookTwap) return;
    setMarkets({
      pass: await openbook.account.market.fetch(proposal.account.openbookPassMarket),
      fail: await openbook.account.market.fetch(proposal.account.openbookFailMarket),
      passTwap: await openbookTwap.account.twapMarket.fetch(
        proposal.account.openbookTwapPassMarket,
      ),
      failTwap: await openbookTwap.account.twapMarket.fetch(
        proposal.account.openbookTwapFailMarket,
      ),
    });
  }, []);

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

  return { proposal, markets, fetchProposal };
}
