/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclure les modules problématiques
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // Ignorer complètement certains modules
    config.module.rules.push({
      test: /\.(html|node)$/,
      use: 'null-loader'
    })

    config.externals = [
      ...config.externals,
      '@mapbox/node-pre-gyp',
      'better-sqlite3',
      'sqlite3',
    ]

    return config
  },
  // Optimisations pour le chargement des pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  poweredByHeader: false,
  // Désactiver le strict mode pour éviter certains problèmes
  reactStrictMode: false,
  experimental: {
    // Désactiver certaines optimisations qui peuvent causer des problèmes
    optimizeFonts: false,
    optimizeImages: false,
  }
}

module.exports = nextConfig 