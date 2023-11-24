import { PublicKey } from '@solana/web3.js';

export const shortKey = (key?: PublicKey | string) => {
  if (!key) return '???';
  const str = key?.toString();
  return `${str.substring(0, 4)}...${str.substring(str.length - 5, str.length)}`;
};

// Define the debounce function
export function debounce<T extends any[]>(
  callback: (...args: T) => Promise<void>,
  delay: number,
): (...args: T) => Promise<void> {
  let timerId: NodeJS.Timeout;
  return async (...args: T) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
