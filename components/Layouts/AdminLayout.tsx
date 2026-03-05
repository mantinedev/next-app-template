'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconChevronRight,
  IconCoin,
  IconDashboard,
  IconFileDescription,
  IconLogout,
  IconMap2,
  IconMoon,
  IconSettings,
  IconSun,
  IconUsersGroup,
} from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  NavLink,
  rem,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const navLinks = [
  {
    icon: IconDashboard,
    label: 'Intelligence Core',
    description: 'Nationwide Heatmap & Stats',
    href: '/admin',
  },
  {
    icon: IconFileDescription,
    label: 'Proposals',
    description: 'Evaluate PO Submissions',
    href: '/admin/proposals',
  },
  {
    icon: IconUsersGroup,
    label: 'Partner Orgs',
    description: 'Manage Field Execution',
    href: '/admin/pos',
  },
  {
    icon: IconCoin,
    label: 'Fund Disbursement',
    description: 'Milestone-based Funding',
    href: '/admin/funds',
  },
  {
    icon: IconMap2,
    label: 'Resource Mapping',
    description: 'Layer 9 Analytics & Health',
    href: '/admin/resource-mapping',
  },
  {
    icon: IconSettings,
    label: 'Policies & Objectives',
    description: 'National Target Setting',
    href: '/admin/policies',
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const items = navLinks.map((item) => {
    const isActive = pathname === item.href;

    return (
      <NavLink
        component={Link}
        href={item.href}
        key={item.label}
        active={isActive}
        label={item.label}
        description={item.description}
        leftSection={<item.icon size="1.2rem" stroke={1.5} />}
        variant="filled"
        style={{ borderRadius: '8px', marginBottom: '4px' }}
        onClick={() => {
          if (opened) {
            toggle();
          }
        }}
      />
    );
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
              PKSF Impact Engine
            </Text>
          </Group>

          <Group gap="sm">
            <ActionIcon
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {mounted ? (
                computedColorScheme === 'dark' ? (
                  <IconSun size="1.2rem" stroke={1.5} />
                ) : (
                  <IconMoon size="1.2rem" stroke={1.5} />
                )
              ) : (
                <div style={{ width: rem(19.2), height: rem(19.2) }} />
              )}
            </ActionIcon>

            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="sm">
                    <Avatar src={null} radius="xl" color="blue">
                      SA
                    </Avatar>
                    <div style={{ flex: 1 }} className="hidden-mobile">
                      <Text size="sm" fw={500}>
                        Super Admin
                      </Text>
                      <Text c="dimmed" size="xs">
                        Strategic Command
                      </Text>
                    </div>
                    <IconChevronRight size="1rem" stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                >
                  System Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Text fw={600} c="dimmed" size="xs" tt="uppercase" mb="sm">
            Strategic Command (Layer 1)
          </Text>
          {items}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
