import { Products } from '@/app/types/product/ListProduct';
import { Table } from '@mantine/core';
import { useEffect, useState } from 'react';

export function ProductList() {
  const [products, setProduct] = useState<Products[]>([]);

  const dataFetch = async () => {
    let data = await fetch('http://localhost:3000/api/product');
    let elements = await data.json();
    setProduct(elements);
  };
  useEffect(() => {
    dataFetch();
  }, []);




  const rows = products.map((product) => (
    <Table.Tr  onClick={() => console.log(product.id)}   style={{ cursor: 'pointer' }} key={product.name}>
            <Table.Td>{product.id}</Table.Td>
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
          <Table.Th>Ürün Id</Table.Th>
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
