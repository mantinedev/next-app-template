'use client';

import { Accordion, Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconCoin, IconExternalLink } from '@tabler/icons-react';
import { shortKey } from '../../lib/utils';
import { MarketCard } from './MarketCard';
import { useAutocrat } from '../../contexts/AutocratContext';

export default function ProposalList() {
  const router = useRouter();
  const { proposals } = useAutocrat();

  return proposals && proposals.length > 0 ? (
    <Stack>
      {proposals.map((proposal) => (
        <Card key={proposal.publicKey.toString()} shadow="sm" radius="md" withBorder m="0" p="0">
          <Accordion>
            <Accordion.Item value={proposal.publicKey.toString()}>
              <Accordion.Control>
                <Stack pr="sm">
                  <Group justify="space-between">
                    <Text size="xl" fw={500}>
                      Proposal #{proposal.account.number + 1}
                    </Text>
                    {proposal.account.state.failed ? (
                      <Badge color="red" variant="light">
                        Failed
                      </Badge>
                    ) : proposal.account.state.passed ? (
                      <Badge color="green" variant="light">
                        Passed
                      </Badge>
                    ) : (
                      <Badge color="yellow" variant="light">
                        Pending
                      </Badge>
                    )}
                  </Group>
                  <Group justify="space-between">
                    <Link href={proposal.account.descriptionUrl}>
                      <Group gap="sm">
                        <Text>Go to description</Text>
                        <IconExternalLink />
                      </Group>
                    </Link>
                    <Text>Proposed by {shortKey(proposal.account.proposer)}</Text>
                  </Group>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel p="0" style={{ padding: '0' }}>
                <Group justify="center" p="0">
                  <MarketCard proposal={proposal} />
                </Group>
              </Accordion.Panel>
              <Group>
                <Button
                  m="sm"
                  variant="default"
                  fullWidth
                  onClick={() => router.push(`/proposal?id=${proposal.account.number}`)}
                >
                  <Group>
                    <Text>Trade</Text>
                    <IconCoin />
                  </Group>
                </Button>
              </Group>
            </Accordion.Item>
          </Accordion>
        </Card>
      ))}
    </Stack>
  ) : (
    <Text size="lg" ta="center" fw="bold">
      There are no proposals yet
    </Text>
  );
}
