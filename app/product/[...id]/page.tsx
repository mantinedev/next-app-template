'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Box, Button, Container, Grid,Group,Skeleton, Text, Title, rem } from '@mantine/core';
import { ProductCard } from '@/app/Maincomponents/Productions/ProductCard';
import { IconBrandWhatsapp } from '@tabler/icons-react';

const Page: React.FC = () => {
  const PRIMARY_COL_HEIGHT = rem(550);
  const phoneNumber = '905467148137'; // Numara buraya
  const message = 'Merhaba, bu linki inceleyin: https://www.orneklink.com';
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
                  <Box>

                  <Button mt={15} h={40} w={'100%'}
                  radius={140}
        component="a"
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        variant="gradient"
          gradient={{ from: '#01FA50', to: '#05D447', deg:145 }}
      >
       <IconBrandWhatsapp/> WhatsApp ile İletişim
      </Button>
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
