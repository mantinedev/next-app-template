import { useCallback, useEffect, useState } from 'react';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  Signer,
} from '@solana/web3.js';
import { IdlAccounts, IdlTypes, Program, BN, utils } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { OracleConfigParams } from '@openbook-dex/openbook-v2';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useAutocrat } from './useAutocrat';
import { useTokens } from './useTokens';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '../lib/constants';
import { useConditionalVault } from './useConditionalVault';
import { OpenbookTwap, IDL as OPENBOOK_TWAP_IDL } from '../lib/idl/openbook_twap';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '../lib/idl/openbook_v2';
import { AutocratV0 } from '../lib/idl/autocrat_v0';
import { useProvider } from './useProvider';

export type ProposalAccount = IdlAccounts<AutocratV0>['proposal'];
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

export type InitializeProposalType = (
  url: string,
  instruction: ProposalInstruction,
) => Promise<void>;
export function useProposals() {
  const { connection } = useConnection();
  const { initializeVault } = useConditionalVault();
  const { program, dao, daoTreasury, daoState, fetchState } = useAutocrat();
  const wallet = useWallet();
  const provider = useProvider();
  const openbook = new Program<OpenbookV2>(OPENBOOK_IDL, OPENBOOK_PROGRAM_ID, provider);
  const openbookTwap = new Program<OpenbookTwap>(
    OPENBOOK_TWAP_IDL,
    OPENBOOK_TWAP_PROGRAM_ID,
    provider,
  );
  const { tokens } = useTokens();
  const [proposals, setProposals] =
    useState<{ account: ProposalAccount; publicKey: PublicKey }[]>();
  const baseNonce: BN = new BN(daoState?.proposalCount || 0);

  const fetchProposals = useCallback(async () => {
    setProposals((await program.account.proposal.all()) as any);
  }, [program]);

  useEffect(() => {
    if (!proposals) {
      fetchProposals();
    }
  }, [proposals, fetchProposals]);

  const initializeProposal: InitializeProposalType = useCallback(
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
        vaultTx.instructions.length > 0 ? vaultTx : null,
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
          'singleGossip',
        );
      }
      fetchState();
      fetchProposals();
    },
    [dao, program, connection, wallet],
  );

  return { proposals, fetchProposals, initializeProposal };
}
