import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep pg (PostgreSQL) server-side only — prevents "Can't resolve dns/net/tls/fs" errors.
  // This is the Turbopack-compatible way (Next.js 15+)
  serverExternalPackages: ['pg', 'pg-pool', 'pg-native', 'pg-connection-string'],
  async redirects() {
    return [
      {
        source: '/state/:slug',
        destination: '/tenders/state/:slug',
        permanent: true,
      },
      {
        source: '/category/:slug',
        destination: '/tenders/category/:slug',
        permanent: true,
      },
      {
        source: '/authority/:slug',
        destination: '/tenders/authority/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
