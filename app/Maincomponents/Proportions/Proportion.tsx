import { RingProgress, Text, SimpleGrid, Paper, Center, Group, rem } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

const data = [
  { label: 'Toplam Müşteri', stats: '456,578', progress: 65, color: '#FF9900', icon: 'up' },
  { label: 'Satılan Ürün', stats: '105,762', progress: 72, color: '#FF9900', icon: 'up' },
  {
    label: 'Toplam Ürün',
    stats: '4,735',
    progress: 52,
    color: '#FF9900',
    icon: 'up',
  },
] as const;

export function Proportions() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group >
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid style={{marginBottom:'10%'}} cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}