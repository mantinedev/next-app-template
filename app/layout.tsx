import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from '../components/Providers/Providers';
import '@solana/wallet-adapter-react-ui/styles.css';
import './main.css';
import '@mantine/core/styles.css';

export const metadata = {
  title: 'Futarchy - MetaDAO',
  description: 'Market governance, for the people',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/meta.jpg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
