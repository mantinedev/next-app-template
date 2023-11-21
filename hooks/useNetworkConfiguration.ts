import { useLocalStorage } from '@mantine/hooks';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

export enum Networks {
  Mainnet = 'mainnet-beta',
  Devnet = 'devnet',
  Localnet = 'local',
  Custom = 'custom',
}

export function useNetworkConfiguration() {
  const [network, setNetwork] = useLocalStorage<Networks>({
    key: 'meta-dao-network-configuration',
    defaultValue: Networks.Mainnet,
    getInitialValueInEffect: true,
  });
  const [customEndpoint, setCustomEndpoint] = useLocalStorage<string>({
    key: 'futarchy-custom-endpoint',
    defaultValue: 'https://sudden-jocelyn-fast-mainnet.helius-rpc.com/',
    getInitialValueInEffect: true,
  });
  const endpoint = useMemo(() => {
    switch (network) {
      case Networks.Mainnet:
        return 'https://sudden-jocelyn-fast-mainnet.helius-rpc.com/';
      case Networks.Devnet:
        return 'https://occupational-rochell-fast-devnet.helius-rpc.com/';
      case Networks.Localnet:
        return 'http://127.0.0.1:8899';
      case Networks.Custom:
        return customEndpoint;
      default:
        return clusterApiUrl('mainnet-beta');
    }
  }, [network, customEndpoint]);

  return { endpoint, network, setNetwork, setCustomEndpoint };
}
