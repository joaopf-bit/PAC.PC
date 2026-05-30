/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Desativa o cache em disco do webpack que gera o erro de "big strings"
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  // Evita que o Next.js gaste memória gerando mapas de código fonte
  productionBrowserSourceMaps: false,
};

export default nextConfig;