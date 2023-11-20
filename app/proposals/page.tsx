'use client';

import { Container, Stack } from '@mantine/core';
import { Layout } from '@/components/Layout/Layout';
import ProposalList from '../../components/Proposals/ProposalList';

export default function ProposalsPage() {
  return (
    <Layout>
      <Container p="0">
        <Stack gap="15">
          <ProposalList />
        </Stack>
      </Container>
    </Layout>
  );
}
