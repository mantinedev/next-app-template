import { useCallback } from 'react';
import { Button, Card, Text } from '@mantine/core';
import { useAutocrat } from '../../hooks/useAutocrat';

export function CreateProposalCard() {
  const { initializeProposal, program, dao, daoTreasury } = useAutocrat();

  const handleCreate = useCallback(async () => {
    const dummyUrl = 'https://www.eff.org/cyberspace-independence';
    const accounts = [
      {
        pubkey: dao,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: daoTreasury,
        isSigner: true,
        isWritable: false,
      },
    ];
    const data = program.coder.instruction.encode('set_pass_threshold_bps', {
      passThresholdBps: 1000,
    });

    const instruction = {
      programId: program.programId,
      accounts,
      data,
    };

    initializeProposal(dummyUrl, instruction);
  }, [program, initializeProposal, dao, daoTreasury]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text>Create a new proposal</Text>
      <Button onClick={handleCreate}>Create proposal</Button>
    </Card>
  );
}
