import { PublicKey } from '@solana/web3.js';

export const shortKey = (key?: PublicKey | string) => {
  if (!key) return '???';
  const str = key?.toString();
  return `${str.substring(0, 4)}...${str.substring(str.length - 5, str.length)}`;
};
