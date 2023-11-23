import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';

export function NotificationLink({ signature }: { signature: string }) {
  const { generateExplorerLink } = useExplorerConfiguration();
  return (
    <a href={generateExplorerLink(signature, 'tx')} target="_blank" rel="noreferrer">
      {signature}
    </a>
  );
}
