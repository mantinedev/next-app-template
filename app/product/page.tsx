'use client';
import { Container, Drawer, Button, Box, Title } from '@mantine/core';
import { ProductCard } from '../Maincomponents/Productions/ProductCard';
import { useDisclosure } from '@mantine/hooks';
import classes from './productpage.module.css';
import PriceFilter from './components/Filters/priceFilter';
import CategoryFilter from './components/Filters/categoryFilter';
import { Products } from '../types/product/ListProduct';
import { useState } from 'react';
import Link from 'next/link';

const Page: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(true);
  const [category, setCategory] = useState<any>(null);
  const [down, setDown] = useState<any>(null);
  const [up, setUp] = useState<any>(null);

  return (
    <Container mt={30} size="xl">
      <Drawer
        title="Saat Endüstrisi"
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        size="sm"
      >
        <CategoryFilter setCat={setCategory} />
        {/* <GenderFilter /> */}
        <PriceFilter setDown={setDown} setUp={setUp} />
        <Link style={{ flex: 1 }} href={`/product?cr=${category}&dpr=${down}&upr=${up}`}>
          <Button
            onClick={close}
            style={{ width: '100%' }}
            variant="gradient"
            gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
          >
            Filtrele
          </Button>
        </Link>
      </Drawer>
      <Box m={20} display={'flex'} mb="md" className={classes.titleplace}>
        <Title order={3} size="h1">
          Ürün Listesi
        </Title>

        <Button
          variant="gradient"
          gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
          onClick={open}
        >
          Filtrele
        </Button>
      </Box>

      <ProductCard />
    </Container>
  );
};

export default Page;
