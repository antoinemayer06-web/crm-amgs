/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/automatisation-gestion-projet",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/automatisation-administrative-financiere",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/etude-de-cas",
        destination: "/nos-derniers-projets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
