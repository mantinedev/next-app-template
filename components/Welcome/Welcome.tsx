import { Title, Text } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Meta-DAO
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        The Meta-DAO is a new cybernetic institution managed by programs stored on the Solana
        blockchain. Instead of token-voting or liquid democracy, the Meta-DAO uses futarchy.
      </Text>
    </>
  );
}
