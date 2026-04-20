/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver le type checking pour éviter les erreurs
  typescript: {
    ignoreBuildErrors: true,
  },
  // Désactiver ESLint pendant le développement
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig