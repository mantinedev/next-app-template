import { useCallback } from 'react';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Program, BN, utils } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAutocrat } from '@/contexts/AutocratContext';
import { useTokens } from './useTokens';
import { OPENBOOK_PROGRAM_ID, OPENBOOK_TWAP_PROGRAM_ID } from '../lib/constants';
import { useConditionalVault } from './useConditionalVault';
import { OpenbookTwap, IDL as OPENBOOK_TWAP_IDL } from '../lib/idl/openbook_twap';
import { IDL as OPENBOOK_IDL, OpenbookV2 } from '../lib/idl/openbook_v2';
import { useProvider } from './useProvider';
import { ProposalInstruction } from '../lib/types';
import { createOpenbookMarket } from '../lib/openbook';

export function useInitializeProposal() {
  const { connection } = useConnection();
  const { initializeVault } = useConditionalVault();
  const { program, dao, daoTreasury, daoState, fetchState, fetchProposals } = useAutocrat();
  const wallet = useWallet();
  const provider = useProvider();
  const openbook = new Program<OpenbookV2>(OPENBOOK_IDL, OPENBOOK_PROGRAM_ID, provider);
  const openbookTwap = new Program<OpenbookTwap>(
    OPENBOOK_TWAP_IDL,
    OPENBOOK_TWAP_PROGRAM_ID,
    provider,
  );
  const { tokens } = useTokens();
  const baseNonce: BN = new BN(daoState?.proposalCount || 0);

  const initializeProposal = useCallback(
    async (url: string, instruction: ProposalInstruction) => {
      if (
        !wallet?.publicKey ||
        !wallet.signAllTransactions ||
        !tokens?.meta ||
        !tokens?.usdc ||
        !daoTreasury ||
        !program
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
    [dao, program, connection, wallet, tokens],
  );

  return initializeProposal;
}
