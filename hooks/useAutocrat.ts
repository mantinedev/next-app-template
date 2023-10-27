import { useCallback, useMemo } from 'react';
import { Program, utils } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AutocratV0, IDL as AUTOCRAT_IDL } from '../lib/idl/autocrat_v0';
import { useProvider } from './useProvider';
import { tokens } from '../lib/tokens';

export function useAutocrat() {
  const provider = useProvider();
  const programId = new PublicKey('Ctt7cFZM6K7phtRo5NvjycpQju7X6QTSuqNen2ebXiuc');
  const dao = useMemo(
    () =>
      PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('WWCACOTMICMIBMHAFTTWYGHMB')],
        programId,
      )[0],
    [programId],
  );
  const program = useMemo(
    () => new Program<AutocratV0>(AUTOCRAT_IDL, programId, provider),
    [provider, programId],
  );

  const initializeDao = useCallback(async () => {
    await program.methods
      .initializeDao()
      .accounts({
        dao,
        metaMint: tokens[0].publicKey,
        : tokens[0].publicKey,
      })
      .rpc();
  }, [program, dao]);

  return { program, initializeDao };
}
