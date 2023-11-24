import { useMemo } from 'react';
import { OPENBOOK_PROGRAM_ID, OpenBookV2Client } from '@openbook-dex/openbook-v2';
import { useProvider } from '@/hooks/useProvider';

export function useOpenbook() {
  const provider = useProvider();
  const openbook = useMemo(() => new OpenBookV2Client(provider, OPENBOOK_PROGRAM_ID), [provider]);

  return openbook;
}
