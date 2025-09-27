/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/test',
        destination: '/icerikler',
        permanent: true, // Kalıcı yönlendirme (301)
      },
      {
        source: '/testler',
        destination: '/icerikler',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
