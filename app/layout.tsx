import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  Flex,
  mantineHtmlProps,
  MantineProvider,
  Title,
} from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AppShell padding={'md'} header={{ height: 45 }}>
            <AppShellHeader>
              <Flex mih={45} direction={'row'} align="center" justify={'flex-start'} px="md">
                <Title order={3}>Spese di casa</Title>
              </Flex>
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
