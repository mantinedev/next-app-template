import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export interface Token {
  name: string;
  symbol: string;
  icon: string;
  publicKey: PublicKey;
  decimals: number;
  tokenProgram: PublicKey;
}

export const tokens: Token[] = [
  {
    name: 'Solana',
    symbol: 'SOL',
    icon: '',
    publicKey: new PublicKey('So11111111111111111111111111111111111111112'),
    decimals: 9,
    tokenProgram: TOKEN_PROGRAM_ID,
  },
];
