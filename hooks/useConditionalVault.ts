import { useCallback, useMemo } from 'react';
import { Program, utils, BN } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { ConditionalVault, IDL as CONDITIONAL_VAULT_IDL } from '../lib/idl/conditional_vault';
import { useProvider } from './useProvider';

export function useConditionalVault() {
  const provider = useProvider();
  const programId = new PublicKey('vaU1tVLj8RFk7mNj1BxqgAsMKKaL8UvEUHvU3tdbZPe');
  const program = useMemo(
    () => new Program<ConditionalVault>(CONDITIONAL_VAULT_IDL, programId, provider),
    [provider, programId],
  );

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
      };
    },
    [program],
  );

  return { program, initializeVault };
}
