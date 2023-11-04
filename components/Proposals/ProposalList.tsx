'use client';

import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { useProposals } from '../../hooks/useProposals';

export default function ProposalList() {
  const { proposals } = useProposals();

  return proposals ? (
    <Stack>
      {proposals.map((proposal) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Norway Fjord Adventures</Text>
            {proposal.state.failed ? (
              <Badge color="red" variant="light">
                Failed
              </Badge>
            ) : proposal.state.passed ? (
              <Badge color="green" variant="light">
                Passed
              </Badge>
            ) : (
              <Badge color="yellow" variant="light">
                Pending
              </Badge>
            )}
          </Group>
        </Card>
      ))}
    </Stack>
  ) : (
    <Text>There are no proposals yet</Text>
  );
}
