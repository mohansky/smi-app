// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import { build, Options } from 'velite';
import type { NextConfig } from 'next';

async function runVeliteBuild(options: Options = {}) {
  const dev = process.env.NODE_ENV === 'development';
  
  const buildOptions: Options = {
    ...options,
    watch: options.watch ?? dev,
    clean: options.clean ?? !dev
  };

  await build(buildOptions);
}

const nextConfig: NextConfig = {
  // Run Velite build on initial startup
  typescript: {
    ignoreBuildErrors: true // Optional, depending on your setup
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Run Velite build only once during client-side compilation
      runVeliteBuild().catch(console.error);
    }
    return config;
  }
};

export default nextConfig;


 