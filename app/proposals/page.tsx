'use client';

import { Container, Stack } from '@mantine/core';
import { Layout } from '@/components/Layout/Layout';
import ProposalList from '../../components/Proposals/ProposalList';
import { CreateProposalCard } from '../../components/Proposals/CreateProposalCard';

export default function ProposalsPage() {
  return (
    <Layout>
      <Container>
        <Stack gap="15">
          <ProposalList />
          <CreateProposalCard />
        </Stack>
      </Container>
    </Layout>
  );
}
