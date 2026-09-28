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
      // Une seule URL canonique indexable : le domaine apex sans "www".
      // Évite de diluer le référencement entre plusieurs hôtes équivalents.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.amgrowthsolutions.fr" }],
        destination: "https://amgrowthsolutions.fr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "amgrowthsolutions.vercel.app" }],
        destination: "https://amgrowthsolutions.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
