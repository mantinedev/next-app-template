import { Program, utils } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Clob, IDL as CLOB_IDL } from '@/lib/idl/clob';
import { useProvider } from './useProvider';

export function useClob() {
  const wallet = useWallet();
  const provider = useProvider();
  const programId = new PublicKey('8BnUecJAvKB7zCcwqhMiVWoqKWcw5S6PDCxWWEM2oxWA');
  const [globalState] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode('WWCACOTMICMIBMHAFTTWYGHMB')],
    programId,
  );
  const program = useMemo(
    () => new Program<Clob>(CLOB_IDL, programId, provider),
    [provider, programId],
  );

  const initializeState = useCallback(async () => {
    if (!wallet?.publicKey) return;

    await program.methods
      .initializeGlobalState(wallet.publicKey)
      .accounts({
        globalState,
      })
      .rpc({ skipPreflight: true });
  }, [program, globalState]);

  const initializeOrderbook = useCallback(
    async (base: PublicKey, quote: PublicKey) => {
      if (!wallet?.publicKey) return;

      const [orderBook] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('order_book'), base.toBuffer(), quote.toBuffer()],
        program.programId,
      );

      const baseVault = getAssociatedTokenAddressSync(base, orderBook, true);

      const quoteVault = getAssociatedTokenAddressSync(quote, orderBook, true);

      await program.methods
        .initializeOrderBook()
        .accounts({
          orderBook,
          globalState,
          base,
          quote,
          baseVault,
          quoteVault,
        })
        .rpc();
    },
    [program, globalState],
  );

  return { program, initializeState, initializeOrderbook };
}
