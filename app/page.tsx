import { Container } from '@mantine/core';
import { Description } from './Maincomponents/Description/Description';
import MainHero from './Maincomponents/MainHero/MainHero';
import { Proportions } from './Maincomponents/Proportions/Proportion';
import { ProductCard } from './Maincomponents/Productions/ProductCard';

export default function HomePage() {
  return (
    <>
    <Container size={'xl'} >
    <MainHero/>
    <Description/>
    <Proportions/>
    <ProductCard/>
    </Container>
  
     </>
  );
}
