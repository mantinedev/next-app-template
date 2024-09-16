import { Box, CloseButton, Input, Text, Title } from '@mantine/core';
import React, { useState } from 'react';

const PriceFilter = () => {
  const [starting, setStarting] = useState('');
  const [ending, setEnding] = useState('');

  return (
   <>
   <Box  mt={20} mb={40} p={5}>
      <Title order={3} size="h3">Fiyat Aralığı</Title>
      <Box style={{gap:15}}  display={'flex'}>
      <Input
        placeholder="En Düşük"
        value={starting}
        onChange={(event) => setStarting(event.currentTarget.value)}
        rightSectionPointerEvents="all"
        mt="md"
        rightSection={
          <CloseButton
            aria-label=""
            onClick={() => setStarting('')}
            style={{ display: starting ? undefined : 'none' }}
          />
        }
      />
       <Input
        placeholder="En Yüksek"
        value={ending}
        onChange={(event) => setEnding(event.currentTarget.value)}
        rightSectionPointerEvents="all"
        mt="md"
        rightSection={
          <CloseButton
            onClick={() => setEnding('')}
            style={{ display: ending ? undefined : 'none' }}
          />
        }
      />
      </Box>
   
   </Box>
   </>
  );
};

export default PriceFilter;
