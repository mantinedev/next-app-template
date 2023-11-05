'use client';

import { Container, Stack } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout/Layout';
import { ProposalDetailCard } from '@/components/Proposals/ProposalDetailCard';

export default function ProposalsPage() {
  const params = useSearchParams();
  const proposalNumber = Number(params.get('id'));
  return (
    <Layout>
      <Container>
        <Stack gap="15">
          <ProposalDetailCard proposalNumber={proposalNumber} />
        </Stack>
      </Container>
    </Layout>
  );
}
