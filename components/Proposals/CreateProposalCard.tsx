import { Button, Card, Text } from '@mantine/core';
import { useAutocrat } from '../../hooks/useAutocrat';

export function CreateProposalCard() {
  const { initializeProposal } = useAutocrat();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text>Create a new proposal</Text>
      <Button onClick={initializeProposal}>Create proposal</Button>
    </Card>
  );
}
