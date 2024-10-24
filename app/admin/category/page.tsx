'use client';
import { Box, Container, Modal, Title } from '@mantine/core';
import React, { useState } from 'react';
import { CategoryList } from './categorylist';
import classes from '../adminpage.module.css';
import AddCategory from './addcategory/addcategory';
import { useDisclosure } from '@mantine/hooks';
import UpdateCategory from './updatecategory/updatecategory';
import { Category } from '@/app/types/category/ListCategory';
import { useCounterStore } from '@/app/providers/counter-store-provider';
const page = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )
  const [opened, { open, close }] = useDisclosure(false);
  const [data,setData]=useState<Category>()
  return (
    <Container mt="lg" size="xl">
      <Box mb="md" className={classes.titleplace}>
        <Title order={3} size="h1">
          Kategori Listesi
          {count}
        </Title>
        <AddCategory />
      </Box>
      <CategoryList setData={setData} open={open}/>
      <Modal opened={opened} size="xl" title="Kategori Güncelleme" centered onClose={close}>
        <UpdateCategory data={data} close={close}/>
      </Modal>
    </Container>
  );
};

export default page;
