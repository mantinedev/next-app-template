'use client';

import { useEffect, useState } from 'react';
import { Card, Group, SimpleGrid, Text, Title } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { fetchUserStats } from './actions';

export default function HomePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Date | null>(new Date('2025-05-01'));
  const [stats, setStats] = useState({ paid: 0, toPay: 0, toReceive: 0, received: 0 });

  useEffect(() => {
    if (selectedPeriod) {
      fetchUserStats('me', selectedPeriod).then(setStats);
    }
  }, [selectedPeriod]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Statistiche pagamenti</Title>
        <MonthPickerInput
          label="Seleziona mese"
          value={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text size="sm" c="dimmed">
            Pagato
          </Text>
          <Text fw={700} size="xl">
            {stats.paid} €
          </Text>
        </Card>

        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text size="sm" c="dimmed">
            Da pagare
          </Text>
          <Text fw={700} size="xl">
            {stats.toPay} €
          </Text>
        </Card>

        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text size="sm" c="dimmed">
            Da ricevere
          </Text>
          <Text fw={700} size="xl">
            {stats.toReceive} €
          </Text>
        </Card>

        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text size="sm" c="dimmed">
            Ricevuto
          </Text>
          <Text fw={700} size="xl">
            {stats.received} €
          </Text>
        </Card>
      </SimpleGrid>
    </Card>
  );
}
