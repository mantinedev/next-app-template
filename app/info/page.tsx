import { Container } from '@mantine/core';
import React from 'react';
import { FeaturesGrid } from './components/FeatureGrid';

const Page: React.FC = () => {
  return (
    <Container size="xl">
      <FeaturesGrid />
    </Container>

  );
};

export default Page;
