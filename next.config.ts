/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
      // Note: Tender ID redirection will happen via a logical fallback in the page itself 
      // or we could add a specific route for ID if needed.
    ]
  }
};

export default nextConfig;
