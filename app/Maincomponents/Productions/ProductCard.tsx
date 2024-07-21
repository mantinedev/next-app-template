"use client"
import { Badge, Button, Card, Center, Group, Image,SimpleGrid, Text } from '@mantine/core';
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import classes from './ProductCard.module.css';



const cards=[
              { label: 'Apple Watch', icon: IconUsers,
                            desc:'iyi',
                            model:'ios',
                            sürüm:'2023',
                            price:'250$',
                            link:'https://e7.pngegg.com/pngimages/204/549/png-clipart-apple-watch-smartwatch-wearable-technology-apple-products-electronics-gadget.png'
               },
               { label: 'Galaxy Watch', icon: IconUsers,
                            desc:'iyi',
                            model:'android',
                            sürüm:'2023',
                            price:'400$',
                            link:'https://e7.pngegg.com/pngimages/92/365/png-clipart-samsung-gear-s3-samsung-galaxy-gear-smartwatch-samsung-watch-accessory-bluetooth.png'
               },
               { label: 'Classic', icon: IconUsers,
                            desc:'iyi',
                            model:'',
                            sürüm:'2023',
                            price:'1000$',
                            link:'https://image.similarpng.com/very-thumbnail/2020/08/Classic-silver-watch-black-dial-leather-strap-on-transparent-background-PNG.png'
               },
]

export function ProductCard() {
 

  const card = cards.map((card)=>(
              <Card withBorder radius="md" className={classes.card}>
              <Card.Section className={classes.imageSection}>
                <Image src={card.link} alt="Tesla Model S" />
              </Card.Section>
        
              <Group justify="space-between" mt="md">
                <div>
                  <Text fw={500}>{card.label}</Text>
                  <Text fz="xs" c="dimmed">
                   {card.desc}
                  </Text>
                </div>
                <Badge variant="outline" color='#FF9100'>25% off</Badge>
              </Group>
        
              <Card.Section  className={classes.section} mt="md">
                <Text  fz="sm" c="dimmed" className={classes.label}>
                  {card.model}
                </Text>
              </Card.Section>
        
              <Card.Section className={classes.section}>
                <Group gap={30}>
                  <div>
                    <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                      {card.price}
                    </Text>
                    <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
                      per day
                    </Text>
                  </div>
        
                  <Button radius="xl" style={{ flex: 1 }} variant="gradient"
            gradient={{ from: '#FF9100', to: '#FF6200' }}>
                    İncele
                  </Button>
                </Group>
              </Card.Section>
            </Card>
  ))
  return <SimpleGrid style={{marginBottom:'10%'}} cols={{ base: 1, sm: 3 }}>{card}</SimpleGrid>;

}