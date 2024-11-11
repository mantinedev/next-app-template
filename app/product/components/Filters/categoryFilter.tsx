import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Stack, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { GetCategoryList } from '@/app/actions/category/GET/getCategoryList';

interface Category {
  id: number;
  name: string;
}

const CategoryFilter = ({ setCat }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectCategories, setSelectCategories] = useState<any[]>([]);
  const params = useSearchParams();
  const SelectCat = params.get('cr');

  console.log(selectCategories);
  // Kategorileri JSON formatında çekiyoruz
  useEffect(() => {
    const fetchCategories = async () => {
      // Örnek JSON verisi
      let data = await GetCategoryList()
      setCategories(data);
    };
    // Kategorileri al ve selectCategories'ı güncelle
    fetchCategories();

    if (SelectCat) {
      setSelectCategories(SelectCat.split(',').map(String));
      setCat(...selectCategories,SelectCat);
    }
  }, [SelectCat]); // SelectCat değiştiğinde effecti tetikle

  return (
    <Box mt={10} mb={10}>
      <Title mb={10} order={3} size="h4">
        Kategori Filtresi
      </Title>
      <Stack>
        {categories.map((category) => (
          <Checkbox
            checked={selectCategories.includes(category.id)}
            key={category.id}
            label={category.name}
            value={category.name}
            onChange={() => {
              if (selectCategories.includes(category.id)) {
                setSelectCategories(selectCategories.filter((id) => id !== category.id));
                setCat(selectCategories.filter((id) => id !== category.id));
              } else {
                setSelectCategories([...selectCategories, category.id]);
                setCat([...selectCategories, category.id]);
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
export default CategoryFilter;
