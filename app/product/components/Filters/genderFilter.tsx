'use-client';
import { Box, MultiSelect, Title } from '@mantine/core';
import React, { useState } from 'react';

const GenderFilter = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <>
      <Box>
              <Title order={3} size="h3" mb={10}>Cinsiyet Filtresi</Title>
      <MultiSelect
     
      placeholder="Cinsiyet Seçiniz"
      data={['Kadın', 'Erkek', 'Unisex']}
    />
      </Box>
    </>
  );
};

export default GenderFilter;
