'use client';

import { Button, Group, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      {colorScheme === 'dark' && (
        <Button style={{ backgroundColor: 'transparent' }} onClick={() => setColorScheme('light')}>
          <IconSun style={{ width: '15px' }} />
        </Button>
      )}
      {colorScheme === 'light' && (
        <Button style={{ color:'black',backgroundColor: 'transparent' }} onClick={() => setColorScheme('dark')}>
          <IconMoon style={{ width: '15px' }} />
        </Button>
      )}
    </Group>
  );
}
