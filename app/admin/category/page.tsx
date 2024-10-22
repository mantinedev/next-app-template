'use client';
import { Box, Container, Title } from '@mantine/core';
import React from 'react';
import { CategoryList } from './categorylist';
import classes from '../adminpage.module.css';
import AddCategory from './addcategory/addcategory';
const page = () => {
  return (
    <Container mt="lg" size="xl">
      <Box mb="md" className={classes.titleplace}>
        <Title order={3} size="h1">
          Kategori Listesi
        </Title>
        <AddCategory />
      </Box>
      <CategoryList />
    </Container>
  );
};

export default page;
