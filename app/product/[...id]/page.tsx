'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Group, Skeleton, Text, Title, rem } from '@mantine/core';
import { ProductCard } from '@/app/Maincomponents/Productions/ProductCard';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { Products } from '@/app/types/product/ListProduct';

const Page: React.FC = () => {
  const params = useParams();
  const [data, setData] = useState<Products>();
  const dataFetch = async () => {
    let data = await fetch(`http://localhost:3000/api/product/detail?idr=${params.id}`);
    let elements = await data.json();

    // Dönen bilgiyi console'a yazdır

    setData(elements);
  };
  useEffect(() => {
    dataFetch();
  }, []);

  const PRIMARY_COL_HEIGHT = rem(550);
  const phoneNumber = '905467148137'; // Numara buraya
  const message = 'Merhaba, bu linki inceleyin: https://www.orneklink.com';
  return (
    <>
      <Container mt="md" size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <div
              style={{
                width: '100%',
                height: PRIMARY_COL_HEIGHT,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {data?.image1 ? (
                <img
                  src={data.image1}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              ) : (
                <Skeleton
                  height={PRIMARY_COL_HEIGHT}
                  radius="md"
                  animate={true}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
            </div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Grid mt="md" gutter="md">
              <Grid.Col>
                <Box>
                  <Title order={4}>{data?.name}</Title>
                </Box>
              </Grid.Col>
              <Grid.Col mt="xl" span={6}>
                <Group>
                  <Text fw={500} size="lg">
                    Ürün Fiyatı:
                  </Text>
                  <Text> {data?.price}₺</Text>
                </Group>
              </Grid.Col>
              <Grid.Col mt="xl" span={6}>
                <Group>
                  <Text fw={500} size="lg">
                    Ürün Stok Durumu:
                  </Text>
                  <Text> {data?.stock}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col>
                <Box>
                  <Title order={2}>Ürün Açıklaması</Title>
                  <Text size="md"> {data?.descrip}</Text>
                </Box>
                <Box>
                  <Button
                    mt={15}
                    h={40}
                    w={'100%'}
                    radius={140}
                    component="a"
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    variant="gradient"
                    gradient={{ from: '#01FA50', to: '#05D447', deg: 145 }}
                  >
                    <IconBrandWhatsapp /> WhatsApp ile İletişim
                  </Button>
                </Box>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
        <Box m={20} mb="md">
          <Title mb={10}>Benzer Ürünler</Title>
              <ProductCard/>
        </Box>
      </Container>
    </>
  );
};

export default Page;
