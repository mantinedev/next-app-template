import React from 'react';
import { FeaturesGrid } from './components/FeatureGrid';
import { Container } from '@mantine/core';
import UploadImage from '../product/[...id]/uploadimage';

const Page: React.FC = () => {
  return (
    <Container size="xl">
      <FeaturesGrid />
      <UploadImage/>
    </Container>

  );
};

export default Page;
