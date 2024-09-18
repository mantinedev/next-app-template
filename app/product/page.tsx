'use client';
import { Container, Drawer, Button, Box, Title } from '@mantine/core';
import { ProductCard } from '../Maincomponents/Productions/ProductCard';
import { useDisclosure } from '@mantine/hooks';
import classes from './productpage.module.css';
import ColorFilter from './components/Filters/colorFilter';
import GenderFilter from './components/Filters/genderFilter';
import PriceFilter from './components/Filters/priceFilter';
import CategoryFilter from './components/Filters/categoryFilter';

const Page: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(true);

  return (
    <Container mt={30} size="xl">
      <Drawer
      title='Saat Endüstrisi'
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        size="sm"
      >
      
        <CategoryFilter />
        <ColorFilter />
        <GenderFilter />
        <PriceFilter />
        <Button
          style={{ width: '100%' }}
          variant="gradient"
          gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
        >
          Filtrele
        </Button>
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
      <ProductCard />
    </Container>
  );
};

export default Page;
