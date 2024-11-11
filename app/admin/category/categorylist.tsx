import { GetCategoryList } from '@/app/actions/category/GET/getCategoryList';
import { Category } from '@/app/types/category/ListCategory';
import { Table } from '@mantine/core';
import { useEffect, useState } from 'react';


export function CategoryList({open,setData}:any) {

  const [categories, setCategories] = useState<Category[]>([]);

  const dataFetch = async () => {
    let data = await GetCategoryList();
    setCategories(data);
  };
  useEffect(() => {
    dataFetch();
  }, []);


  const handleData= (category:Category)=>{
    setData(category)
    open();
  }
  const rows = categories.map((category) => (
    <Table.Tr onClick={()=>handleData(category)}  style={{ cursor: 'pointer',textAlign:'center'}}>
      <Table.Td>{category.name}</Table.Td>

    </Table.Tr>
  ));

  return (
    <Table horizontalSpacing={'xl'} withTableBorder  highlightOnHover  stickyHeader stickyHeaderOffset={60}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{textAlign:'center'}}>Kategori Adı</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
              <Table.Caption>Kategori Listeniz</Table.Caption>
            </Table>
  );
}
