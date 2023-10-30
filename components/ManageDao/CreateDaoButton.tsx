'use client';

import { Button } from '@mantine/core';
import { useCallback } from 'react';
import { useAutocrat } from '../../hooks/useAutocrat';
import { useTokens } from '../../hooks/useTokens';

export default function CreateDaoButton() {
  const { tokens } = useTokens();
  const { program: autocratProgram, initializeDao } = useAutocrat();

  const handleCreateDao = useCallback(async () => {
    await initializeDao();
  }, [autocratProgram, tokens]);

  return <Button onClick={() => handleCreateDao()}>Initialize DAO</Button>;
}
