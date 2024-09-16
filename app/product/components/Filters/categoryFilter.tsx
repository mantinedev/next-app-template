import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Stack, Title } from '@mantine/core';

interface Category {
  id: number;
  name: string;
}

const CategoryFilter = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Kategorileri JSON formatında çekiyoruz
  useEffect(() => {
    const fetchCategories = async () => {
      // Örnek JSON verisi
      const data: Category[] = [
        { id: 1, name: 'Klasik' },
        { id: 2, name: 'Spor' },
        { id: 3, name: 'Günlük' },
        { id: 1, name: 'Klasik' },
        { id: 2, name: 'Spor' },
        { id: 3, name: 'Günlük' },
        { id: 1, name: 'Klasik' },
        { id: 2, name: 'Spor' },
        { id: 3, name: 'Günlük' },
      ];
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <Box mt={10} mb={10}>
      <Title  mb={10} order={3} size="h3"> Kategori Filtresi</Title>
   <Stack>
      {categories.map((category) => (
        <Checkbox
          key={category.id}
          label={category.name}
          value={category.name}
        />
      ))}
    </Stack>
    </Box>
 
  );
};

export default CategoryFilter;
