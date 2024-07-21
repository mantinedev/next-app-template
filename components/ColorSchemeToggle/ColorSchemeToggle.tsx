'use client';

import { Button, Group, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSettings, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      <Button style={{backgroundColor:'transparent'}} onClick={() => setColorScheme('light')}><IconSun style={{width:'15px'}}/></Button>
      <Button style={{backgroundColor:'transparent'}}onClick={() => setColorScheme('dark')}><IconMoon  style={{width:'15px'}}/></Button>
      <Button style={{backgroundColor:'transparent'}}onClick={() => setColorScheme('auto')}><IconSettings  style={{width:'15px'}}/></Button>
    </Group>
  );
}
