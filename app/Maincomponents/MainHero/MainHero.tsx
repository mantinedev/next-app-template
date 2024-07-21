import { Container, Text, Button, Group, Image } from '@mantine/core';
import classes from './MainHero.module.css';
import image from '../../../assets/watch.png';

export function MainHero() {
  return (
    <div className={classes.wrapper}>
      <Container size="lg" className={classes.inner}>
        <Group>
          <div className={classes.content}>

            <div className={classes.textContainer}>
              <h1 className={classes.title}>
                Yeni Nesil{' '}
                <Text component="span" variant="gradient" gradient={{ from: '#FF9900', to: '#FF6200' }} inherit>
                  Saat
                </Text>{' '}
                Endüstrisi
              </h1>
              <Text className={classes.description} color="dimmed">
                Modern, Şık ve Teknolojik. Bir saat'den daha fazlası
              </Text>
              <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: '#FF9100', to: '#FF6200' }}
          >
            Başlayalım
          </Button>

            </div>
            <div className={classes.imageContainer}>
              <Image src={image.src} className={classes.image} />

            </div>
          </div>
        </Group>
      </Container>
    </div>
  );
}


export default MainHero;