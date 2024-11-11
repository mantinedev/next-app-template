import { useEffect, useState } from 'react';
import { Title } from '@mantine/core';
import {
  IconHome2,
  IconCategory,
} from '@tabler/icons-react';
import classes from './DoubleNavbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Yeni import

export function DoubleNavbar() {
  const [active, setActive] = useState('Saat Endüstrisi');
  const [activeLink, setActiveLink] = useState('Ürünler');

  const pathname = usePathname(); // URL'i almak için

  useEffect(() => {
    // URL'e göre aktif linki ayarla
    if (pathname?.includes('/admin/category')) {
      setActiveLink('Kategoriler');
    } else if (pathname?.includes('/admin')) {
      setActiveLink('Ürünler');
    }
  }, [pathname]);

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
