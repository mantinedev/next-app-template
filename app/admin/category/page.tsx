'use client';
import { Box, Modal, Title } from '@mantine/core';
import React, { useState } from 'react';
import { CategoryList } from './categorylist';
import classes from '../adminpage.module.css';
import AddCategory from './addcategory/addcategory';
import { useDisclosure } from '@mantine/hooks';
import UpdateCategory from './updatecategory/updatecategory';
import { Category } from '@/app/types/category/ListCategory';
import { DoubleNavbar } from '@/components/Navbar/Navbar';
const page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data,setData]=useState<Category>()
  return (
    <Box display={'flex'}>
    <DoubleNavbar />
    <Box display={'content'} w={'90%'} p={14}>
      

      <Box  className={classes.titleplace}>
        <Title order={3} size="h1">
          Kategori Listesi
        </Title>
        <AddCategory />
      </Box>
      <CategoryList setData={setData} open={open}/>
      <Modal opened={opened} size="xl" title="Kategori Güncelleme" centered onClose={close}>
        <UpdateCategory data={data} close={close}/>
      </Modal>
      </Box>
    </Box>
  );
};

export default page;
