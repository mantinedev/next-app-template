'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Layout } from '../components/Layout/Layout';
import '@mantine/notifications/styles.css';

export default function HomePage() {
  return (
    <Layout>
      <Welcome />
      <ColorSchemeToggle />
      <Button onClick={() => notifications.show({
        title: 'Test notif',
        message: 'Message',
      })}
      >Notification
      </Button>
    </Layout>
  );
}
