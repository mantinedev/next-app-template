'use client';
import { Box, Container, Modal, Title } from '@mantine/core';
import React, { useState } from 'react';
import { ProductList } from './product/productlist';
import AddProduct from './components/addproduct/addproduct';
import classes from './adminpage.module.css';
import ProductPreview from './product/detail/productpreview';
import { useDisclosure } from '@mantine/hooks';
import { useCounterStore } from '../providers/counter-store-provider';
const page = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )
  const [opened, { open, close }] = useDisclosure(false);
  const [id, setId] = useState('');

  return (
    <Container mt="lg" size="xl">
      <Box mb="md" className={classes.titleplace}>
        <Title order={3} size="h1">
          Ürün Listesi
        </Title>
        <AddProduct />
      </Box>
      <ProductList setId={setId} open={open} />
      <button onClick={incrementCount}>Arttır</button>
      {count}
      <button onClick={decrementCount}>Azalt</button>
      <Modal opened={opened} size="xl" title="Ürün Önizleme" centered onClose={close}>
        <ProductPreview id={id} />
      </Modal>
    </Container>
  );
};

export default page;
