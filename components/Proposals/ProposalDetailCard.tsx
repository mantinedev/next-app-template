import { Card, Group, Loader, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import { useProposal } from '../../hooks/useProposal';

export function ProposalDetailCard({ proposalNumber }: { proposalNumber: number }) {
  const { proposal, markets } = useProposal(proposalNumber);
  console.log(proposal, markets);
  return !proposal || !markets ? (
    <Loader />
  ) : (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw="bolder" size="xl">
        Proposal #{proposal.account.number}
      </Text>
      <Link href={proposal.account.descriptionUrl}>
        <Group gap="sm">
          <Text>Go to description</Text>
          <IconExternalLink />
        </Group>
      </Link>
      <Group gap="md" justify="space-around" p="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <Text>Pass market</Text>
            <Text>{markets.passTwap.twapOracle.expectedValue.toString()}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <Text>Fail market</Text>
            <Text>{markets.failTwap.twapOracle.expectedValue.toString()}</Text>
          </Stack>
        </Card>
      </Group>
    </Card>
  );
}
