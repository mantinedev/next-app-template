import { Products } from '@/app/types/product/ListProduct';
import { Table } from '@mantine/core';
import { useEffect, useState } from 'react';

export function ProductList({open,setId}:any) {
  const [products, setProduct] = useState<Products[]>([]);

  const dataFetch = async () => {
    let data = await fetch('http://localhost:3000/api/product');
    let elements = await data.json();
    setProduct(elements);
  };
  useEffect(() => {
    dataFetch();
  }, []);

  const handleClick = (id: number | string): void => {
   open()
   setId(id)
}


  const rows = products.map((product) => (
    <Table.Tr  onClick={()=>handleClick(product.id)}   style={{ cursor: 'pointer' }} key={product.id}>
      <Table.Td>{product.name}</Table.Td>
      <Table.Td>{product.price}</Table.Td>
      <Table.Td>{product.stock}</Table.Td>
      <Table.Td>{product.descrip}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table horizontalSpacing={'xl'} withTableBorder  highlightOnHover  stickyHeader stickyHeaderOffset={60}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Ürün Adı</Table.Th>
          <Table.Th>Ürün Fiyatı</Table.Th>
          <Table.Th>Ürün Stock Durumu</Table.Th>
          <Table.Th>Ürün Açıklaması</Table.Th>
        
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      <Table.Caption>Ürün Listeniz</Table.Caption>
    </Table>
  );
}
