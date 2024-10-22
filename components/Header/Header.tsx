'use client';
import {
  Group,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
} from '@mantine/core';

import classes from './Header.module.css';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import Link from 'next/link';
import AdminLogin from '../AdminLogin/AdminLogin';

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" w="100%">
          <Group justify="flex-start" h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Anasayfa
            </Link>
            <Link href="/product" className={classes.link}>
              Ürün Listesi
            </Link>

            <Link href="/info" className={classes.link}>
              Hakkımızda
            </Link>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />

          <Group justify="flex-end" h="100%">
            <ColorSchemeToggle />
            <AdminLogin />
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Saat Endüstrisi"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea mx="-md">
          <Divider my="sm" />
          <Link href="/" className={classes.link}>
            Anasayfa
          </Link>
          <Link href="/product" className={classes.link}>
            Ürün Listesi
          </Link>

          <Link href="/info" className={classes.link}>
            Hakkımızda
          </Link>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Header;
