import { Badge } from '@mantine/core';
import { ProposalAccountWithKey } from '@/lib/types';

export function StateBadge({ proposal }: { proposal: ProposalAccountWithKey }) {
  if (!proposal) return null;
  if (proposal.account.state.pending) {
    return <Badge color="yellow">Pending</Badge>;
  }
  if (proposal.account.state.passed) {
    return <Badge color="green">Passed</Badge>;
  }
  return <Badge color="red">Failed</Badge>;
}
