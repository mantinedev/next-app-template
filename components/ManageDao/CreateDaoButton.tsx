'use client';

import { Button } from '@mantine/core';
import { useCallback } from 'react';
import { useAutocrat } from '../../contexts/AutocratContext';
import { useTokens } from '../../hooks/useTokens';
import { useAutocratDebug } from '../../hooks/useAutocratDebug';

export default function CreateDaoButton() {
  const { tokens } = useTokens();
  const { program: autocratProgram } = useAutocrat();
  const { initializeDao } = useAutocratDebug();

  const handleCreateDao = useCallback(async () => {
    await initializeDao();
  }, [autocratProgram, tokens]);

  return <Button onClick={() => handleCreateDao()}>Initialize DAO</Button>;
}
