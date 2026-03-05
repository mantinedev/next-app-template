'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  IconAlertTriangle,
  IconBriefcase,
  IconCoin,
  IconHeartbeat,
  IconMap,
  IconMapPin,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { AreaChart, BarChart } from '@mantine/charts';
import {
  Alert,
  Badge,
  Card,
  Grid,
  Group,
  Skeleton,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { AdminLayout } from '@/components/Layouts/AdminLayout';
import { districtDataMap, mapConfigs, MapType } from './mapConfig';

const HeatmapMap = dynamic(() => import('@/components/Heatmap'), {
  ssr: false,
  loading: () => <Skeleton height={600} radius="md" />,
});

const roiData = [
  { month: 'Jan', investment: 1200000, valueGenerated: 400000 },
  { month: 'Feb', investment: 1900000, valueGenerated: 900000 },
  { month: 'Mar', investment: 2100000, valueGenerated: 1600000 },
  { month: 'Apr', investment: 2500000, valueGenerated: 2800000 },
  { month: 'May', investment: 2800000, valueGenerated: 3900000 },
  { month: 'Jun', investment: 3100000, valueGenerated: 5200000 },
];

const demandData = [
  { sector: 'Agro-Tech', pipeline: 450, demand: 800 },
  { sector: 'RMG', pipeline: 1200, demand: 900 },
  { sector: 'IT Services', pipeline: 300, demand: 1100 },
  { sector: 'Light Engineering', pipeline: 600, demand: 650 },
  { sector: 'Healthcare', pipeline: 250, demand: 500 },
];

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Market Oversaturation Detected',
    message:
      'RMG sector training in Dhaka exceeds projected 6-month industry demand by 33%. Consider halting new proposals.',
    time: '10 mins ago',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Child Malnutrition Spike',
    message:
      'Daycare logs in Kurigram indicate a 15% drop in average nutritional intake over the last 30 days.',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'success',
    title: 'High Poverty Graduation Rate',
    message:
      'TMSS Agro-program in Bogra achieved an 82% sustained employment rate. Recommended for national scaling.',
    time: '1 day ago',
  },
];

export default function IntelligenceCorePage() {
  const [activeMap, setActiveMap] = useState<MapType>('economy');
  const currentMapConfig = mapConfigs[activeMap];

  return (
    <AdminLayout>
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Intelligence Core</Title>
            <Text c="dimmed">Real-time macroeconomic pulse and policy feedback.</Text>
          </div>
          <Badge color="blue" variant="light" size="lg">
            Live System Status: Optimal
          </Badge>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="sm" c="dimmed">
                  National Skill Match
                </Text>
                <ThemeIcon color="teal" variant="light">
                  <IconBriefcase size="1.2rem" />
                </ThemeIcon>
              </Group>
              <Group align="flex-end" gap="xs">
                <Text fw={700} size="xl">
                  78.4%
                </Text>
                <Text c="teal" size="sm" fw={500}>
                  +2.1% this month
                </Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="sm" c="dimmed">
                  Household Health Index
                </Text>
                <ThemeIcon color="red" variant="light">
                  <IconHeartbeat size="1.2rem" />
                </ThemeIcon>
              </Group>
              <Group align="flex-end" gap="xs">
                <Text fw={700} size="xl">
                  62.1
                </Text>
                <Text c="red" size="sm" fw={500}>
                  -0.4% this month
                </Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="sm" c="dimmed">
                  High-Risk Thanas
                </Text>
                <ThemeIcon color="orange" variant="light">
                  <IconMapPin size="1.2rem" />
                </ThemeIcon>
              </Group>
              <Group align="flex-end" gap="xs">
                <Text fw={700} size="xl">
                  14
                </Text>
                <Text c="dimmed" size="sm" fw={500}>
                  Flagged for intervention
                </Text>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={12}>
            <Card shadow="sm" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600}>Macroeconomic & Human Capital Geolocation</Text>
                <Badge color="red" variant="dot">
                  Live System Feed
                </Badge>
              </Group>

              <Tabs value={activeMap} onChange={(val) => setActiveMap(val as MapType)}>
                <Tabs.List mb="md">
                  <Tabs.Tab value="economy" leftSection={<IconMap size="1rem" />}>
                    Economic Pulse
                  </Tabs.Tab>
                  <Tabs.Tab value="mismatch" leftSection={<IconUsers size="1rem" />}>
                    Labor Mismatch
                  </Tabs.Tab>
                  <Tabs.Tab value="health" leftSection={<IconHeartbeat size="1rem" />}>
                    Health Pulse
                  </Tabs.Tab>
                  <Tabs.Tab value="roi" leftSection={<IconCoin size="1rem" />}>
                    Fund ROI
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>

              <HeatmapMap
                mapKey={activeMap}
                dataMap={districtDataMap}
                getValue={currentMapConfig.getValue}
                getColor={currentMapConfig.getColor}
                getTooltipContent={currentMapConfig.getTooltip}
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card shadow="sm" radius="md" withBorder h="100%">
              <Text fw={600} mb="lg">
                Fund ROI & Economic Value Generation
              </Text>
              <AreaChart
                h={300}
                data={roiData}
                dataKey="month"
                series={[
                  { name: 'investment', color: 'red.6', label: 'Funds Disbursed' },
                  { name: 'valueGenerated', color: 'teal.6', label: 'Verified Income' },
                ]}
                curveType="bump"
                withDots={false}
                valueFormatter={(value) => `৳ ${(value / 1000000).toFixed(1)}M`}
                yAxisProps={{ width: 70, tickMargin: 10 }}
                xAxisProps={{ padding: { left: 20, right: 20 } }}
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card shadow="sm" radius="md" withBorder h="100%">
              <Text fw={600} mb="md">
                Automated Policy Feedback
              </Text>
              <Stack gap="sm">
                {alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    variant="light"
                    color={
                      alert.type === 'critical'
                        ? 'red'
                        : alert.type === 'warning'
                          ? 'orange'
                          : 'teal'
                    }
                    title={alert.title}
                    icon={alert.type === 'critical' ? <IconAlertTriangle /> : <IconTrendingUp />}
                  >
                    <Text size="xs" mb="xs">
                      {alert.message}
                    </Text>
                    <Text size="xs" c="dimmed" ta="right">
                      {alert.time}
                    </Text>
                  </Alert>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={12}>
            <Card shadow="sm" radius="md" withBorder>
              <Text fw={600} mb="lg">
                Labor Demand Forecaster (6-Month Projection)
              </Text>
              <BarChart
                h={300}
                data={demandData}
                dataKey="sector"
                series={[
                  { name: 'pipeline', color: 'blue.5', label: 'Current Trainee Supply' },
                  { name: 'demand', color: 'violet.5', label: 'Industry Hiring Demand' },
                ]}
                tickLine="y"
                yAxisProps={{ width: 50 }}
              />
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </AdminLayout>
  );
}
