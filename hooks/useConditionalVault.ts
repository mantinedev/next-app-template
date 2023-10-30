import { useCallback, useMemo } from 'react';
import { Program, utils, BN } from '@coral-xyz/anchor';
import { Keypair, PublicKey, Signer } from '@solana/web3.js';
import { MethodsBuilder } from '@coral-xyz/anchor/dist/cjs/program/namespace/methods';
import { AllInstructions } from '@coral-xyz/anchor/dist/cjs/program/namespace/types';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { ConditionalVault, IDL as CONDITIONAL_VAULT_IDL } from '../lib/idl/conditional_vault';
import { useProvider } from './useProvider';

export function useConditionalVault() {
  const provider = useProvider();
  const programId = new PublicKey('4nCk4qKJSJf8pzJadMnr9LubA6Y7Zw3EacsVqH1TwVXH');
  const program = useMemo(
    () => new Program<ConditionalVault>(CONDITIONAL_VAULT_IDL, programId, provider),
    [provider, programId],
  );

  const initializeVault = useCallback(
    async (
      settlementAuthority: PublicKey,
      underlyingTokenMint: PublicKey,
      nonce: BN,
    ): Promise<{
      builder: MethodsBuilder<ConditionalVault, AllInstructions<ConditionalVault>>;
      signers: Signer[];
    }> => {
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

      const conditionalTokenMintKeypair = Keypair.generate();

      return {
        builder: program.methods
          .initializeConditionalVault(settlementAuthority, nonce)
          .accounts({
            vault,
            underlyingTokenMint,
            vaultUnderlyingTokenAccount,
            conditionalTokenMint: conditionalTokenMintKeypair.publicKey,
            payer: provider.publicKey,
          })
          .signers([conditionalTokenMintKeypair]),
        signers: [conditionalTokenMintKeypair],
      };
    },
    [program],
  );

  return { program, initializeVault };
}
