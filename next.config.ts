import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    // Disable ESLint during builds (temporarily)
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
