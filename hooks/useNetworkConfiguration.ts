import { useLocalStorage } from '@mantine/hooks';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

export enum Networks {
  Mainnet = 'mainnet-beta',
  Devnet = 'devnet',
  Localnet = 'local',
}

export function useNetworkConfiguration() {
  const [network, setNetwork] = useLocalStorage<Networks>({
    key: 'meta-dao-network-configuration',
    defaultValue: Networks.Mainnet,
  });
  const endpoint = useMemo(() => {
    switch (network) {
      case Networks.Mainnet:
        return 'https://sudden-jocelyn-fast-mainnet.helius-rpc.com/';
      case Networks.Devnet:
        return 'https://occupational-rochell-fast-devnet.helius-rpc.com/';
      case Networks.Localnet:
        return 'http://127.0.0.1:8899';
      default:
        return clusterApiUrl('mainnet-beta');
    }
  }, [network]);

  return { endpoint, network, setNetwork };
}
