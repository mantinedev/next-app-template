import { useState } from 'react';
import { UnstyledButton, Tooltip, Title, rem } from '@mantine/core';
import {
  IconHome2,
  IconCategory,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './DoubleNavbar.module.css';
import Link from 'next/link';

export function DoubleNavbar() {
  const [active, setActive] = useState('Saat Endüstrisi');
  const [activeLink, setActiveLink] = useState('Ürünler');



  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>

          <Link
            onClick={(event) => {
              setActiveLink('Ürünler');
            }}
            data-active={activeLink === 'Ürünler' || undefined}
            className={classes.link}
            href="/admin"
          >
            <IconHome2 />
            Ürünler
          </Link>
          <Link
            onClick={(event) => {
              setActiveLink('Kategoriler');
            }}
            data-active={activeLink === 'Kategoriler' || undefined}
            className={classes.link}
            href="/admin/category"
          >
            <IconCategory />
            Kategoriler
          </Link>
        </div>
      </div>
    </nav>
  );
}
