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
    ];
  },
};

export default nextConfig;
