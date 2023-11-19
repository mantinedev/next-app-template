import { render, screen, tests } from '@/test-utils';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  tests.itSupportsClassName({ component: Welcome, props: {} });

  it('has correct Next.js theming section link', () => {
    render(<Welcome />);
    expect(screen.getByText('this guide')).toHaveAttribute(
      'href',
      'https://mantine.dev/guides/next/'
    );
  });
});
