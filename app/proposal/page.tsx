'use client';

import { Container, Stack } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout/Layout';

export default function ProposalsPage() {
  const params = useSearchParams();
  const proposalNumber = Number(params.get('id'));
  return (
    <Layout>
      <Container>
        <Stack gap="15">tre</Stack>
      </Container>
    </Layout>
  );
}
