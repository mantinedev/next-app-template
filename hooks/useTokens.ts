import { useLocalStorage } from '@mantine/hooks';
import { Token } from '../lib/tokens';

type TokenKeys = 'meta' | 'usdc';

export function useTokens() {
  const [tokens, setTokens] = useLocalStorage<Partial<{ [key in TokenKeys]: Token }>>({
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    key: 'futarchy-tokens',
  });

  return { tokens, setTokens };
}
