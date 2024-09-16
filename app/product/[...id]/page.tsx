'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Box, Container, Grid,Group,Skeleton, Text, Title, rem } from '@mantine/core';
import { ProductCard } from '@/app/Maincomponents/Productions/ProductCard';

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const PRIMARY_COL_HEIGHT = rem(550);
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <>
      <Container mt="md" size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={true} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Grid mt='md' gutter="md">
              <Grid.Col>
                <Box>
                  <Title order={4}>
                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, reiciendis.
                  </Title>
                  </Box>
              </Grid.Col>
              <Grid.Col mt='xl' span={6}>
              <Group>
                <Text  fw={500} size="lg">Ürün Fiyatı:</Text><Text>300₺</Text>
                </Group>
              </Grid.Col>
              <Grid.Col  mt='xl' span={6}>
                <Group>
                <Text  fw={500} size="lg">Ürün Stok Durumu:</Text><Text>15</Text>
                </Group>
              </Grid.Col>
              <Grid.Col>
                <Box>
                  <Title order={2}>
                   Ürün Açıklaması
                  </Title>
                  <Text size="md">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Voluptates consequuntur rem dolorem? Eos quaerat doloremque fugiat? 
                    Delectus quo nisi, voluptatibus quod similique sapiente eos soluta quaerat 
                    quis sed ullam eum unde earum vel? Veniam omnis fugit ea fugiat, 
                    accusantium enim.</Text>
                  </Box>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
        <Box m={20}  mb='md'>
          <Title mb={10}>
            Benzer Ürünler
          </Title>
          <ProductCard/>
        </Box>
      </Container>
    </>
  );
};

export default Page;
