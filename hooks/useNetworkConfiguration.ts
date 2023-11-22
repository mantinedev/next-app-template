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
        return 'https://mainnet.helius-rpc.com/?api-key=3f6d553e-de08-4fb9-9212-5d87bbfd1328';
      case Networks.Devnet:
        return 'https://devnet.helius-rpc.com/?api-key=3f6d553e-de08-4fb9-9212-5d87bbfd1328';
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
