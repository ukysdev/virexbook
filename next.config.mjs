/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'http://192.168.56.1',
    'http://localhost',
    'http://127.0.0.1',
  ],
}

export default nextConfig
