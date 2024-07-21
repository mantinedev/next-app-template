"use client"
import {
    Group,
    Divider,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    useMantineTheme,
  } from '@mantine/core';
  import { MantineLogo } from '@mantinex/mantine-logo';
  
  import classes from './Header.module.css';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
  
  
  
  export function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
  
    return (
      <Box >
        <header className={classes.header}>
          <Group justify="flex-start" h="100%">
  
  
            <Group h="100%" gap={0} visibleFrom="sm">
              <a href="#" className={classes.link}>
                Anasayfa
              </a>
            
              <a href="/learn" className={classes.link}>
                Ürün Listesi
              </a>
              <a href="#" className={classes.link}>
               Hakkımızda
              </a>
            </Group>
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
          <Group justify='flex-end' h="100%"> 
            <ColorSchemeToggle/>
          </Group>
        </header>
  
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea mx="-md">
            <Divider my="sm" />
  
            <a href="#" className={classes.link}>
              Home
            </a>
            
            <Collapse in={linksOpened}></Collapse>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>
  
          </ScrollArea>
        </Drawer>
      </Box>
    );
  }
  
  export default Header;