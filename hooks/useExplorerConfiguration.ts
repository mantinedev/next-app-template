import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';

export enum Explorers {
  SolanaFM = 'solanafm',
  Solscan = 'solscan',
  Xray = 'xray',
  Solana = 'solana'
}

export function useExplorerConfiguration() {
  const [explorer, setExplorer] = useLocalStorage<Explorers>({
    key: 'meta-dao-explorer-configuration',
    defaultValue: Explorers.SolanaFM,
  });
  const endpoint = useMemo(() => {
    switch (explorer) {
      case Explorers.SolanaFM:
        return 'https://solana.fm/';
      case Explorers.Solscan:
        return 'https://solscan.io/';
      case Explorers.Xray:
        return 'https://xray.helius.xyz/';
      case Explorers.Solana:
        return 'https://explorer.solana.com/';
      default:
        return 'https://explorer.solana.com/';
    }
  }, [explorer]);

  return { endpoint, explorer, setExplorer };
}
