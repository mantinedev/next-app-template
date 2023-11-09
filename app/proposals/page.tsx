'use client';

import { Container, Stack } from '@mantine/core';
import { Layout } from '@/components/Layout/Layout';
import ProposalList from '../../components/Proposals/ProposalList';
import { CreateProposalCard } from '../../components/Proposals/CreateProposalCard';
import { useProposals } from '../../hooks/useProposals';

export default function ProposalsPage() {
  const { proposals, initializeProposal } = useProposals();
  return (
    <Layout>
      <Container>
        <Stack gap="15">
          <ProposalList proposals={proposals} />
          <CreateProposalCard action={initializeProposal} />
        </Stack>
      </Container>
    </Layout>
  );
}
