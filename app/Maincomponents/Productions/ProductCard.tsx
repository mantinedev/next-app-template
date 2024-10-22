'use client';
import { Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core';
import classes from './ProductCard.module.css';
import Link from 'next/link';
import { Products } from '@/app/types/product/ListProduct';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';


export function ProductCard() {
  const params = useSearchParams()
  const dpr = params.get('dpr');
  const upr = params.get('upr');
  const cr =params.get('cr');
  console.log(upr)
  const [products, setProduct] = useState<Products[]>([]);
  const dataFetch = async () => {
    

    // Eğer dpr veya upr null ise isteği gönderme
    let data = await fetch(`http://localhost:3000/api/product?cr=${cr}&dpr=${dpr}&upr=${upr}`);
    let elements = await data.json();
    setProduct(elements);
  };
  useEffect(() => {
    dataFetch();
  }, [dpr,upr,cr]);

  const card = products.map((card) => (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src={card.image1} alt="Tesla Model S" />
      </Card.Section>

     

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          {card.name}  <Badge variant="outline" color="#FF9100">
          25% off
        </Badge>
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="lg" fw={700} style={{ lineHeight: 1 }}>
              {card.price}₺
            </Text>
            
          </div>
          <Link    style={{ flex: 1 }} href={`/product/${card.id}`}>
          <Button
            radius="xl"
            style={{width:'100%', flex: 1 }}
            variant="gradient"
            gradient={{ from: '#FF9100', to: '#FF6200' }}
          >
           İncele
          </Button>
          </Link>
        </Group>
      </Card.Section>
    </Card>
  ));
  return (
    <SimpleGrid style={{ marginBottom: '10%' }} cols={{ base: 1, sm: 3 }}>
      {card}
    </SimpleGrid>
  );
}
