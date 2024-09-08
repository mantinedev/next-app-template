import { Container } from '@mantine/core';
import React from 'react';
import UploadImage from '../admin/components/uploadimage';
import { FeaturesGrid } from './components/FeatureGrid';

const Page: React.FC = () => {
  return (
    <Container size="xl">
      <FeaturesGrid />
      <UploadImage/>
    </Container>

  );
};

export default Page;
