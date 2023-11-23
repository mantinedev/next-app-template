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
import { useConnection } from '@solana/wallet-adapter-react';
import { AutocratV0 } from '../lib/idl/autocrat_v0';
import { useProvider } from '@/hooks/useProvider';
import { AUTOCRAT_PROGRAM_ID, OPENBOOK_PROGRAM_ID } from '@/lib/constants';
import { DaoState, MarketsInfo, ProposalAccountWithKey } from '../lib/types';
import { useNetworkConfiguration } from '../hooks/useNetworkConfiguration';
import { useConditionalVault } from '../hooks/useConditionalVault';
import { useOpenbookTwap } from '../hooks/useOpenbookTwap';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '@/lib/idl/openbook_v2';
import { getLeafNodes } from '../lib/openbook';

const AUTOCRAT_IDL: AutocratV0 = require('@/lib/idl/autocrat_v0.json');

export interface AutocratContext {
  dao?: PublicKey;
  daoTreasury?: PublicKey;
  daoState?: DaoState;
  proposals?: ProposalAccountWithKey[];
  allMarketsInfo: MarketsInfo;
  autocratProgram?: Program<AutocratV0>;
  fetchState: () => Promise<void>;
  fetchProposals: () => Promise<void>;
  fetchMarketsInfo: (proposal: ProposalAccountWithKey) => Promise<void>;
}
export const contextAutocrat = createContext<AutocratContext>({
  allMarketsInfo: {},
  fetchState: () => new Promise(() => {}),
  fetchProposals: () => new Promise(() => {}),
  fetchMarketsInfo: () => new Promise(() => {}),
});
export const useAutocrat = () => {
  const context = useContext<AutocratContext>(contextAutocrat);
  return context;
};
export function AutocratProvider({ children }: { children: ReactNode }) {
  const { network } = useNetworkConfiguration();
  const { connection } = useConnection();
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
  const autocratProgram = useMemo(
    () => new Program<AutocratV0>(AUTOCRAT_IDL, programId, provider),
    [provider, programId],
  );
  const openbook = useMemo(() => {
    if (!provider) {
      return;
    }
    return new Program<OpenbookV2>(OPENBOOK_IDL, OPENBOOK_PROGRAM_ID, provider);
  }, [provider]);
  const { program: openbookTwap } = useOpenbookTwap();
  const { program: vaultProgram } = useConditionalVault();
  const [daoState, setDaoState] = useState<DaoState>();
  const [proposals, setProposals] = useState<ProposalAccountWithKey[]>();
  const [allMarketsInfo, setAllMarketsInfo] = useState<MarketsInfo>({});

  const fetchState = useCallback(async () => {
    setDaoState(await autocratProgram.account.dao.fetch(dao));
  }, [autocratProgram, dao]);

  const fetchProposals = useCallback(async () => {
    const props = ((await autocratProgram?.account.proposal.all()) || []).sort((a, b) =>
      a.account.number < b.account.number ? 1 : -1,
    );
    setProposals(props);
  }, [autocratProgram]);

  const fetchMarketsInfo = useCallback(
    async (proposal: ProposalAccountWithKey) => {
      if (!proposal || !openbook || !openbookTwap || !openbookTwap.views || !connection) {
        return;
      }
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

      setAllMarketsInfo({
        [proposal.publicKey.toString()]: {
          pass,
          passAsks,
          passBids,
          fail,
          failAsks,
          failBids,
          passTwap,
          failTwap,
          baseVault,
          quoteVault,
        },
      });
    },
    [vaultProgram, openbook, openbookTwap],
  );

  // Reset on network change
  useEffect(() => {
    setProposals(undefined);
    setDaoState(undefined);
    fetchProposals();
    fetchState();
  }, [network]);

  return (
    <contextAutocrat.Provider
      value={{
        dao,
        daoTreasury,
        daoState,
        proposals,
        allMarketsInfo,
        autocratProgram,
        fetchState,
        fetchProposals,
        fetchMarketsInfo,
      }}
    >
      {children}
    </contextAutocrat.Provider>
  );
}
