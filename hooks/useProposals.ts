import { useCallback, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { IdlAccounts } from '@coral-xyz/anchor';
import { useAutocrat } from './useAutocrat';
import { AutocratV0 } from '../lib/idl/autocrat_v0';

export type ProposalAccount = IdlAccounts<AutocratV0>['proposal'];

export function useProposals() {
  const { program } = useAutocrat();
  const [proposals, setProposals] =
    useState<{ account: ProposalAccount; publicKey: PublicKey }[]>();

  const fetchProposals = useCallback(async () => {
    setProposals((await program.account.proposal.all()) as any);
  }, [program]);

  useEffect(() => {
    if (!proposals) {
      fetchProposals();
    }
  }, [proposals, fetchProposals]);

  return { proposals, fetchProposals };
}
