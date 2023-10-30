import { useLocalStorage } from '@mantine/hooks';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export interface Token {
  name: string;
  symbol: string;
  icon?: string;
  publicKey: PublicKey;
  decimals: number;
  tokenProgram: PublicKey;
}

const staticTokens = {
  wsol: {
    name: 'Solana',
    symbol: 'SOL',
    icon: '',
    publicKey: new PublicKey('So11111111111111111111111111111111111111112'),
    decimals: 9,
    tokenProgram: TOKEN_PROGRAM_ID,
  },
};

type TokenKeys = 'meta' | 'usdc' | keyof typeof staticTokens;
type TokensDict = Partial<{ [key in TokenKeys]: Token }>;

export function useTokens() {
  const [tokens, setTokens] = useLocalStorage<TokensDict>({
    defaultValue: staticTokens,
    serialize: JSON.stringify,
    deserialize: (s) => {
      if (!s) return {};
      const o: TokensDict = JSON.parse(s);
      return Object.fromEntries(
        Object.entries(o).map(([k, v]: [string, Token]) => [
          k,
          { ...v, publicKey: new PublicKey(v.publicKey) },
        ]),
      );
    },
    key: 'futarchy-tokens',
  });

  return { tokens, setTokens: (newTokens: TokensDict) => setTokens({ ...tokens, ...newTokens }) };
}
