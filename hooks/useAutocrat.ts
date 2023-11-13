import { useCallback, useEffect, useMemo, useState } from 'react';
import { Program, utils } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { IdlAccounts } from '@coral-xyz/anchor/dist/cjs/program/namespace/types';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AutocratV0 } from '../lib/idl/autocrat_v0';
import { useProvider } from './useProvider';
import { useTokens } from './useTokens';
import { AUTOCRAT_PROGRAM_ID } from '../lib/constants';

const AUTOCRAT_IDL: AutocratV0 = require('@/lib/idl/autocrat_v0.json');

export type DaoState = IdlAccounts<AutocratV0>['dao'];

export function useAutocrat() {
  const provider = useProvider();
  const wallet = useWallet();
  const { connection } = useConnection();
  const programId = AUTOCRAT_PROGRAM_ID;
  const { tokens } = useTokens();
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

  const fetchState = async () => {
    try {
      console.log('fetch', dao);
      setDaoState(await program.account.dao.fetch(dao));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!daoState) {
      fetchState();
    }
  }, [dao, program, connection]);

  const initializeDao = useCallback(async () => {
    if (
      !tokens?.meta?.publicKey ||
      !tokens?.usdc?.publicKey ||
      !wallet?.publicKey ||
      !wallet.signAllTransactions ||
      !connection
    ) {
      return;
    }

    const txs: Transaction[] = [];

    const daoTx = new Transaction().add(
      await program.methods
        .initializeDao()
        .accounts({
          dao,
          metaMint: tokens.meta.publicKey,
          usdcMint: tokens.usdc.publicKey,
        })
        .instruction(),
    );

    const blockhask = await connection.getLatestBlockhash();
    daoTx.feePayer = wallet.publicKey!;
    daoTx.recentBlockhash = blockhask.blockhash;

    txs.push(daoTx);

    const signedTxs = await wallet.signAllTransactions(txs);
    await Promise.all(
      signedTxs.map((tx) => connection.sendRawTransaction(tx.serialize(), { skipPreflight: true })),
    );
    fetchState();
  }, [program, dao, wallet, tokens, connection, fetchState]);

  return { program, dao, daoTreasury, daoState, initializeDao, fetchState };
}
