/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'www.shutterstock.com',
            pathname: '/**',
          },
        ],
        // domains: ["img.daisyui.com" , 'www.shutterstock.com'],
      },
};

export default nextConfig;
