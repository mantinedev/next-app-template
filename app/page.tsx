'use client';

import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Layout } from '../components/Layout/Layout';

export default function HomePage() {
  return (
    <Layout>
      <Welcome />
      <ColorSchemeToggle />
    </Layout>
  );
}
