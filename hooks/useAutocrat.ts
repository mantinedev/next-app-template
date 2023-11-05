import { useCallback, useEffect, useMemo, useState } from 'react';
import { Program, utils, BN } from '@coral-xyz/anchor';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { IdlAccounts, IdlTypes } from '@coral-xyz/anchor/dist/cjs/program/namespace/types';
import { OracleConfigParams } from '@openbook-dex/openbook-v2';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AutocratV0 } from '../lib/idl/autocrat_v0';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '../lib/idl/openbook_v2';
import { useProvider } from './useProvider';
import { useTokens } from './useTokens';
import { useConditionalVault } from './useConditionalVault';
import { OpenbookTwap, IDL as OPENBOOK_TWAP_IDL } from '../lib/idl/openbook_twap';
import {
  AUTOCRAT_PROGRAM_ID,
  OPENBOOK_PROGRAM_ID,
  OPENBOOK_TWAP_PROGRAM_ID,
} from '../lib/constants';

const AUTOCRAT_IDL: AutocratV0 = require('@/lib/idl/autocrat_v0.json');

export type DaoState = IdlAccounts<AutocratV0>['dao'];
export type ProposalInstruction = IdlTypes<AutocratV0>['ProposalInstruction'];

const BooksideSpace = 90944 + 8;
const EventHeapSpace = 91280 + 8;

const createProgramAccount = async (
  program: Program<OpenbookV2>,
  authority: PublicKey,
  size: number,
) => {
  const lamports = await program.provider.connection.getMinimumBalanceForRentExemption(size);
  const address = Keypair.generate();
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: authority,
      newAccountPubkey: address.publicKey,
      lamports,
      space: size,
      programId: program.programId,
    }),
  );
  return { tx, signers: [address] };
};

const createOpenbookMarket = async (
  program: Program<OpenbookV2>,
  creator: PublicKey,
  baseMint: PublicKey,
  quoteMint: PublicKey,
  name: string,
  quoteLotSize: BN,
  baseLotSize: BN,
  makerFee: BN,
  takerFee: BN,
  timeExpiry: BN,
  oracleA: PublicKey | null,
  oracleB: PublicKey | null,
  openOrdersAdmin: PublicKey | null,
  consumeEventsAdmin: PublicKey | null,
  closeMarketAdmin: PublicKey | null,
  oracleConfigParams: OracleConfigParams = { confFilter: 0.1, maxStalenessSlots: 100 },
  market: Keypair = Keypair.generate(),
  collectFeeAdmin?: PublicKey,
): Promise<{ signers: Signer[]; instructions: (Transaction | TransactionInstruction)[] }> => {
  const bids = await createProgramAccount(program, creator, BooksideSpace);
  const asks = await createProgramAccount(program, creator, BooksideSpace);
  const eventHeap = await createProgramAccount(program, creator, EventHeapSpace);
  const [marketAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('Market'), market.publicKey.toBuffer()],
    program.programId,
  );
  const baseVault = getAssociatedTokenAddressSync(baseMint, marketAuthority, true);
  const quoteVault = getAssociatedTokenAddressSync(quoteMint, marketAuthority, true);
  const [eventAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('__event_authority')],
    program.programId,
  );

  return {
    signers: [...bids.signers, ...asks.signers, ...eventHeap.signers, market],
    instructions: [
      bids.tx,
      asks.tx,
      eventHeap.tx,
      await program.methods
        .createMarket(
          name,
          oracleConfigParams,
          quoteLotSize,
          baseLotSize,
          makerFee,
          takerFee,
          timeExpiry,
        )
        .accounts({
          market: market.publicKey,
          marketAuthority,
          bids: bids.signers[0].publicKey,
          asks: asks.signers[0].publicKey,
          eventHeap: eventHeap.signers[0].publicKey,
          payer: creator,
          marketBaseVault: baseVault,
          marketQuoteVault: quoteVault,
          baseMint,
          quoteMint,
          oracleA,
          oracleB,
          collectFeeAdmin: collectFeeAdmin != null ? collectFeeAdmin : creator,
          openOrdersAdmin,
          consumeEventsAdmin,
          closeMarketAdmin,
          eventAuthority,
          program: program.programId,
        })
        .instruction(),
    ],
  };
};

export function useAutocrat() {
  const provider = useProvider();
  const wallet = useWallet();
  const { connection } = useConnection();
  const programId = AUTOCRAT_PROGRAM_ID;
  const { initializeVault } = useConditionalVault();
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
  const openbook = new Program<OpenbookV2>(OPENBOOK_IDL, OPENBOOK_PROGRAM_ID, provider);
  const openbookTwap = new Program<OpenbookTwap>(
    OPENBOOK_TWAP_IDL,
    OPENBOOK_TWAP_PROGRAM_ID,
    provider,
  );
  const baseNonce: BN = new BN(daoState?.proposalCount || 0);

  console.log(daoState);

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
  }, [program, dao, wallet, baseNonce, tokens, connection]);

  const initializeProposal = useCallback(
    async (url: string, instruction: ProposalInstruction) => {
      if (
        !wallet?.publicKey ||
        !wallet.signAllTransactions ||
        !daoState ||
        !tokens?.meta ||
        !tokens?.usdc
      ) {
        return;
      }

      /// Init conditional vaults
      const baseVault = await initializeVault(daoTreasury, tokens.meta.publicKey, baseNonce);

      const quoteVault = await initializeVault(
        daoTreasury,
        tokens.usdc.publicKey,
        baseNonce.or(new BN(1).shln(63)),
      );

      const vaultTx = new Transaction();
      if (baseVault.tx) vaultTx.add(baseVault.tx);
      if (quoteVault.tx) vaultTx.add(quoteVault.tx);

      /// Init markets
      const openbookPassMarketKP = Keypair.generate();
      const openbookFailMarketKP = Keypair.generate();
      const [openbookTwapPassMarket] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('twap_market'), openbookPassMarketKP.publicKey.toBuffer()],
        openbookTwap.programId,
      );
      const [openbookTwapFailMarket] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('twap_market'), openbookFailMarketKP.publicKey.toBuffer()],
        openbookTwap.programId,
      );

      const openbookPassMarket = await createOpenbookMarket(
        openbook,
        wallet.publicKey,
        baseVault.finalizeMint,
        quoteVault.finalizeMint,
        'pMETA/pUSDC',
        new BN(100),
        new BN(1e9),
        new BN(0),
        new BN(0),
        new BN(0),
        null,
        null,
        openbookTwapPassMarket,
        null,
        openbookTwapPassMarket,
        { confFilter: 0.1, maxStalenessSlots: 100 },
        openbookPassMarketKP,
      );

      const openbookFailMarket = await createOpenbookMarket(
        openbook,
        wallet.publicKey,
        baseVault.revertMint,
        quoteVault.revertMint,
        'fMETA/fUSDC',
        new BN(100),
        new BN(1e9),
        new BN(0),
        new BN(0),
        new BN(0),
        null,
        null,
        openbookTwapFailMarket,
        null,
        openbookTwapFailMarket,
        { confFilter: 0.1, maxStalenessSlots: 100 },
        openbookFailMarketKP,
      );

      const passMarketTx = new Transaction().add(...openbookPassMarket.instructions);
      const failMarketTx = new Transaction().add(...openbookFailMarket.instructions);

      const createPassTwapMarketIx = await openbookTwap.methods
        .createTwapMarket(new BN(1_000))
        .accounts({
          market: openbookPassMarketKP.publicKey,
          twapMarket: openbookTwapPassMarket,
          payer: wallet.publicKey,
        })
        .instruction();
      const createFailTwapMarketIx = await openbookTwap.methods
        .createTwapMarket(new BN(1_000))
        .accounts({
          market: openbookFailMarketKP.publicKey,
          twapMarket: openbookTwapFailMarket,
          payer: wallet.publicKey,
        })
        .instruction();

      console.log(
        'oiqsdfu',
        {
          market: openbookPassMarketKP.publicKey,
          twapMarket: openbookTwapPassMarket,
          payer: wallet.publicKey,
        },
        {
          market: openbookFailMarketKP.publicKey,
          twapMarket: openbookTwapFailMarket,
          payer: wallet.publicKey,
        },
      );

      const twapsTx = new Transaction().add(createPassTwapMarketIx, createFailTwapMarketIx);

      const proposalKeypair = Keypair.generate();
      const initProposalTx = new Transaction().add(
        await program.account.proposal.createInstruction(proposalKeypair, 1500),
        await program.methods
          .initializeProposal(url, instruction)
          .accounts({
            proposal: proposalKeypair.publicKey,
            dao,
            daoTreasury,
            baseVault: baseVault.vault,
            quoteVault: quoteVault.vault,
            openbookTwapPassMarket,
            openbookTwapFailMarket,
            openbookPassMarket: openbookPassMarketKP.publicKey,
            openbookFailMarket: openbookFailMarketKP.publicKey,
            proposer: wallet.publicKey,
          })
          .instruction(),
      );

      const blockhask = await connection.getLatestBlockhash();
      vaultTx.feePayer = wallet.publicKey!;
      vaultTx.recentBlockhash = blockhask.blockhash;
      twapsTx.feePayer = wallet.publicKey!;
      twapsTx.recentBlockhash = blockhask.blockhash;
      passMarketTx.feePayer = wallet.publicKey!;
      passMarketTx.recentBlockhash = blockhask.blockhash;
      failMarketTx.feePayer = wallet.publicKey!;
      failMarketTx.recentBlockhash = blockhask.blockhash;
      initProposalTx.feePayer = wallet.publicKey!;
      initProposalTx.recentBlockhash = blockhask.blockhash;

      const vaultSigners = [...baseVault.signers, ...quoteVault.signers];
      if (vaultSigners.length > 0) vaultTx.sign(...vaultSigners);
      passMarketTx.sign(...openbookPassMarket.signers);
      failMarketTx.sign(...openbookFailMarket.signers);
      initProposalTx.sign(proposalKeypair);

      const txs = [
        vaultTx.instructions.length > 0 ? vaultSigners : null,
        passMarketTx,
        failMarketTx,
        twapsTx,
        initProposalTx,
      ].filter(Boolean) as Transaction[];
      const signedTxs = await wallet.signAllTransactions(txs);
      // Using loops here to make sure transaction are executed in the correct order
      // eslint-disable-next-line no-restricted-syntax
      for (const tx of signedTxs) {
        // eslint-disable-next-line no-await-in-loop
        await connection.confirmTransaction(
          // eslint-disable-next-line no-await-in-loop
          await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true }),
        );
      }
      setDaoState(await program.account.dao.fetch(dao));
      fetchState();
    },
    [baseNonce, dao, program, connection, wallet],
  );

  return { program, dao, daoTreasury, initializeDao, initializeProposal };
}
