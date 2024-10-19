import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  rem,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import React, { useState } from 'react';
import classes from '../components/addproduct/addproduct.module.css';

const ProductPreview = ({ product, images }: { product: any; images: any }) => {
  const PRIMARY_COL_HEIGHT = rem(450);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <Container mt="md" size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Box style={{ position: 'relative' }}>
              {images[currentImageIndex] ? (
                <img
                  src={URL.createObjectURL(images[currentImageIndex])}
                  alt={`Preview ${currentImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: PRIMARY_COL_HEIGHT,
                    maxHeight: PRIMARY_COL_HEIGHT,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={true} />
              )}
              <Button className={classes.arrowbtnl} onClick={handlePrevImage}>
                <IconChevronLeft size={32} />
              </Button>
              <Button className={classes.arrowbtnr} onClick={handleNextImage}>
                <IconChevronRight size={32} />
              </Button>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Grid mt="md" gutter="md">
              <Grid.Col>
                <Box>
                  <Title order={4}>{product.name}</Title>
                </Box>
              </Grid.Col>
              <Grid.Col mt="xl" span={6}>
                <Group>
                  <Text fw={500} size="lg">
                    Ürün Fiyatı:
                  </Text>
                  <Text>{product.price}₺</Text>
                </Group>
              </Grid.Col>
              <Grid.Col mt="xl" span={6}>
                <Group>
                  <Text fw={500} size="lg">
                    Ürün Stok Durumu:
                  </Text>
                  <Text>{product.stock}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col>
                <Box>
                  <Title order={2}>Ürün Açıklaması</Title>
                  <Text size="md">{product.descrip}</Text>
                </Box>
                <Box>
                  <Button
                    type="submit"
                    mt="md"
                    variant="gradient"
                    gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
                  >
                    Ürünü Ekle
                  </Button>
                </Box>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default ProductPreview;
