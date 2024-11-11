'use client';
import { Box, Container, Modal, Title } from '@mantine/core';
import React, { useState } from 'react';
import { ProductList } from './product/productlist';
import AddProduct from './components/addproduct/addproduct';
import classes from './adminpage.module.css';
import ProductPreview from './product/detail/productpreview';
import { useDisclosure } from '@mantine/hooks';
import { DoubleNavbar } from '@/components/Navbar/Navbar';
const page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [id, setId] = useState('');

  return (
    <Box display={'flex'}>
      <DoubleNavbar />
      <Box display={'content'} w={'90%'} p={14}>
        
        <Box className={classes.titleplace}>
          <Title order={3} size="h1">
            Ürün Listesi
          </Title>
          <AddProduct />
        </Box>
        <ProductList setId={setId} open={open} />
        <Modal opened={opened} size="xl" title="Ürün Önizleme" centered onClose={close}>
          <ProductPreview id={id} />
        </Modal>
      </Box>
    </Box>
  );
};

export default page;
