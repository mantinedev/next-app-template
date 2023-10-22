const withBundleAnalyzer = require( '@next/bundle-analyzer' )( {
  enabled: process.env.ANALYZE === 'true',
} );

module.exports = withBundleAnalyzer( {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: [ '@mantine/core', '@mantine/hooks' ],
  },
} );
