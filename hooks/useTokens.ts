import { useLocalStorage } from '@mantine/hooks';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Networks, useNetworkConfiguration } from './useNetworkConfiguration';

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

const mainnetTokens: TokensDict = {
  meta: {
    name: 'Meta',
    symbol: 'META',
    icon: '',
    publicKey: new PublicKey('METADDFL6wWMWEoKTFJwcThTbUmtarRJZjRpzUvkxhr'),
    decimals: 9,
    tokenProgram: TOKEN_PROGRAM_ID,
  },
  usdc: {
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '',
    publicKey: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    decimals: 6,
    tokenProgram: TOKEN_PROGRAM_ID,
  },
};

const devnetTokens: TokensDict = {
  meta: {
    name: 'Meta',
    symbol: 'META',
    icon: '',
    publicKey: new PublicKey('METADDFL6wWMWEoKTFJwcThTbUmtarRJZjRpzUvkxhr'),
    decimals: 9,
    tokenProgram: TOKEN_PROGRAM_ID,
  },
  usdc: {
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '',
    publicKey: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    decimals: 6,
    tokenProgram: TOKEN_PROGRAM_ID,
  },
};

type TokenKeys = 'meta' | 'usdc' | keyof typeof staticTokens;
type TokensDict = Partial<{ [key in TokenKeys]: Token }>;

export function useTokens() {
  const { network } = useNetworkConfiguration();
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
  const selectDefaultTokens = (n?: Networks) => {
    switch (n) {
      case Networks.Devnet:
        return devnetTokens;
      case Networks.Mainnet:
        return mainnetTokens;
      default:
        return {};
    }
  };

  return {
    tokens: { ...tokens, ...selectDefaultTokens(network) },
    setTokens: (newTokens: TokensDict) =>
      setTokens({ ...tokens, ...newTokens, ...selectDefaultTokens(network) }),
  };
}
