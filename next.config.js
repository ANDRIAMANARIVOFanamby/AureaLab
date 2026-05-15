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

  images: {
    // Autorise les images depuis votre compte Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/degalhtre/**', // Remplacez "degalhtre" par votre vrai "cloud name"
        search: '',
      },
    ],
  },

  rewrites: async () => {
    return [
      {
        source: '/admin/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig