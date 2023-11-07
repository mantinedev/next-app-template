import { useCallback, useMemo } from 'react';
import { Program, utils, BN } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import numeral from 'numeral';
import { ConditionalVault, IDL as CONDITIONAL_VAULT_IDL } from '../lib/idl/conditional_vault';
import { useProvider } from './useProvider';
import { useTokens } from './useTokens';
import { ProposalAccount, VaultAccount } from '../lib/types';

export function useConditionalVault() {
  const provider = useProvider();
  const programId = new PublicKey('vaU1tVLj8RFk7mNj1BxqgAsMKKaL8UvEUHvU3tdbZPe');
  const program = useMemo(
    () => new Program<ConditionalVault>(CONDITIONAL_VAULT_IDL, programId, provider),
    [provider, programId],
  );
  const { tokens } = useTokens();

  const initializeVault = useCallback(
    async (settlementAuthority: PublicKey, underlyingTokenMint: PublicKey, nonce: BN) => {
      const [vault] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('conditional_vault'),
          settlementAuthority.toBuffer(),
          underlyingTokenMint.toBuffer(),
          nonce.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId,
      );

      try {
        const fetchedVault = await program.account.conditionalVault.fetch(vault);
        return {
          signers: [],
          vault,
          finalizeMint: fetchedVault.conditionalOnFinalizeTokenMint,
          revertMint: fetchedVault.conditionalOnRevertTokenMint,
        };
      } catch (err) {
        const vaultUnderlyingTokenAccount = getAssociatedTokenAddressSync(
          underlyingTokenMint,
          vault,
          true,
        );
        const conditionalOnFinalizeTokenMint = Keypair.generate();
        const conditionalOnRevertTokenMint = Keypair.generate();

        return {
          tx: await program.methods
            .initializeConditionalVault(settlementAuthority, nonce)
            .accounts({
              vault,
              underlyingTokenMint,
              vaultUnderlyingTokenAccount,
              conditionalOnFinalizeTokenMint: conditionalOnFinalizeTokenMint.publicKey,
              conditionalOnRevertTokenMint: conditionalOnRevertTokenMint.publicKey,
              payer: provider.publicKey,
            })
            .transaction(),
          signers: [conditionalOnFinalizeTokenMint, conditionalOnRevertTokenMint],
          vault,
          finalizeMint: conditionalOnFinalizeTokenMint.publicKey,
          revertMint: conditionalOnRevertTokenMint.publicKey,
        };
      }
    },
    [program],
  );

  const mintConditionalTokens = useCallback(
    async (
      amount: number,
      proposal: ProposalAccount,
      vault: VaultAccount,
      fromBaseVault?: boolean,
    ) => {
      if (!tokens) {
        return;
      }
      const token = Object.values(tokens).find(
        (e) => e.publicKey.toString() === vault.underlyingTokenMint.toString(),
      )!;

      return {
        ixs: [
          createAssociatedTokenAccountIdempotentInstruction(
            provider.publicKey,
            getAssociatedTokenAddressSync(vault.conditionalOnFinalizeTokenMint, provider.publicKey),
            provider.publicKey,
            vault.conditionalOnFinalizeTokenMint,
          ),
          createAssociatedTokenAccountIdempotentInstruction(
            provider.publicKey,
            getAssociatedTokenAddressSync(vault.conditionalOnRevertTokenMint, provider.publicKey),
            provider.publicKey,
            vault.conditionalOnRevertTokenMint,
          ),
          await program.methods
            .mintConditionalTokens(
              new BN(
                numeral(amount)
                  .multiply(10 ** token.decimals)
                  .format('0'),
              ),
            )
            .accounts({
              vault: fromBaseVault ? proposal.baseVault : proposal.quoteVault,
              userConditionalOnFinalizeTokenAccount: getAssociatedTokenAddressSync(
                vault.conditionalOnFinalizeTokenMint,
                provider.publicKey,
              ),
              userConditionalOnRevertTokenAccount: getAssociatedTokenAddressSync(
                vault.conditionalOnRevertTokenMint,
                provider.publicKey,
              ),
              userUnderlyingTokenAccount: getAssociatedTokenAddressSync(
                vault.underlyingTokenMint,
                provider.publicKey,
              ),
              vaultUnderlyingTokenAccount: vault.underlyingTokenAccount,
              conditionalOnFinalizeTokenMint: vault.conditionalOnFinalizeTokenMint,
              conditionalOnRevertTokenMint: vault.conditionalOnRevertTokenMint,
            })
            .instruction(),
        ],
      };
    },
    [program, tokens],
  );

  return { program, initializeVault, mintConditionalTokens };
}
