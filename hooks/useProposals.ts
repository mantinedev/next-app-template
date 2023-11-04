import { useCallback, useState } from 'react';
import { IdlAccounts } from '@coral-xyz/anchor';
import { useAutocrat } from './useAutocrat';
import { AutocratV0 } from '../lib/idl/autocrat_v0';

export type ProposalAccount = IdlAccounts<AutocratV0>['proposal'];

export function useProposals() {
  const { program } = useAutocrat();
  const [proposals, setProposals] = useState<ProposalAccount[]>();

  const fetchProposals = useCallback(async () => {
    setProposals((await program.account.proposal.all()) as any);
  }, [program]);

  console.log(proposals);

  return { proposals, fetchProposals };
}
