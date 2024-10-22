import { Box, CloseButton, Input, Text, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PriceFilter = ({setDown,setUp}:any) => {
  const [starting, setStarting] = useState('');
  const [ending, setEnding] = useState('');
  const params = useSearchParams();
  const dpr = params.get('dpr');
  const upr = params.get('upr')

useEffect(()=>{
  if (dpr) {
    setStarting(dpr);
    setDown(dpr)
  }
  if(upr){
    setEnding(upr)
    setUp(upr)
  }
},[dpr,upr])

  return (
    <>
      <Box mt={20} mb={40} p={5}>
        <Title order={3} size="h4">Fiyat Aralığı</Title>
        <Box style={{ gap: 15 }} display={'flex'}>
          <Input
            placeholder="En Düşük"
            value={starting}
            onChange={(event) => 
              {setStarting(event.currentTarget.value);
              setDown(event.currentTarget.value)}} // Değeri güncelle
            rightSectionPointerEvents="all"
            mt="md"
            type='number'
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
            onChange={(event) => {
              setEnding(event.currentTarget.value);
              setUp(event.currentTarget.value);
            }}
            
            mt="md"
            type='number'
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
