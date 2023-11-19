import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Program, utils } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AutocratV0 } from '../lib/idl/autocrat_v0';
import { useProvider } from '@/hooks/useProvider';
import { AUTOCRAT_PROGRAM_ID } from '@/lib/constants';
import { DaoState, ProposalAccountWithKey } from '../lib/types';
import { useNetworkConfiguration } from '../hooks/useNetworkConfiguration';

const AUTOCRAT_IDL: AutocratV0 = require('@/lib/idl/autocrat_v0.json');

export interface AutocratContext {
  dao?: PublicKey;
  daoTreasury?: PublicKey;
  daoState?: DaoState;
  proposals?: ProposalAccountWithKey[];
  program?: Program<AutocratV0>;
  fetchState: () => Promise<void>;
  fetchProposals: () => Promise<void>;
}
export const contextAutocrat = createContext<AutocratContext>({
  fetchState: () => new Promise(() => {}),
  fetchProposals: () => new Promise(() => {}),
});
export const useAutocrat = () => {
  const context = useContext<AutocratContext>(contextAutocrat);
  return context;
};
export function AutocratProvider({ children }: { children: ReactNode }) {
  const { network } = useNetworkConfiguration();
  const provider = useProvider();
  const programId = AUTOCRAT_PROGRAM_ID;
  const dao = useMemo(
    () =>
      PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('WWCACOTMICMIBMHAFTTWYGHMB')],
        programId,
      )[0],
    [programId],
  );
  const daoTreasury = useMemo(
    () => PublicKey.findProgramAddressSync([dao.toBuffer()], programId)[0],
    [programId],
  );
  const program = useMemo(
    () => new Program<AutocratV0>(AUTOCRAT_IDL, programId, provider),
    [provider, programId],
  );
  const [daoState, setDaoState] = useState<DaoState>();
  const [proposals, setProposals] = useState<ProposalAccountWithKey[]>();

  const fetchState = useCallback(async () => {
    setDaoState(await program.account.dao.fetch(dao));
  }, [program, dao]);

  const fetchProposals = useCallback(async () => {
    const props = ((await program?.account.proposal.all()) || []).sort((a, b) =>
      a.account.number < b.account.number ? 1 : -1,
    );
    setProposals(props);
  }, [program]);

  useEffect(() => {
    if (!daoState) {
      fetchState();
    }
  }, [daoState, fetchState]);

  useEffect(() => {
    if (!proposals) {
      fetchProposals();
    }
  }, [proposals, fetchProposals]);

  // Reset on network change
  useEffect(() => {
    setDaoState(undefined);
    setProposals(undefined);
  }, [network]);

  return (
    <contextAutocrat.Provider
      value={{ dao, daoTreasury, daoState, proposals, program, fetchState, fetchProposals }}
    >
      {children}
    </contextAutocrat.Provider>
  );
}
