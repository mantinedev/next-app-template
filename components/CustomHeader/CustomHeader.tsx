'use client';
import { FC, PropsWithChildren } from 'react';
import Header from '../Header/Header';
import { AppShell } from '@mantine/core';
import { Footer } from '../Footer/Footer';
import { DoubleNavbar } from '../Navbar/Navbar';

const CustomHeader: FC<PropsWithChildren> = ({ children }) => {


  return (
    <AppShell 
      header={{
        height: 60,
      }}
      footer={{
        height: 70,
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <DoubleNavbar/>
      </AppShell.Navbar>
      <AppShell.Main w={'100%'}>
        

       
        {children}
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default CustomHeader;
