import { useCallback } from 'react';
import { Button, Card, Text } from '@mantine/core';
import { useAutocrat } from '../../hooks/useAutocrat';
import { InitializeProposalType } from '../../hooks/useProposals';

export function CreateProposalCard({ action }: { action: InitializeProposalType }) {
  const { program, dao, daoTreasury } = useAutocrat();
  console.log(action);
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

    action(dummyUrl, instruction);
  }, [program, action, dao, daoTreasury]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text>Create a new proposal</Text>
      <Button onClick={handleCreate}>Create proposal</Button>
    </Card>
  );
}
