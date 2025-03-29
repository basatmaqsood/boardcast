/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode for better drawing performance
  webpack: (config) => {
    // Socket.IO client has a bug with webpack 5, this fixes it
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    })
    return config
  },
}

module.exports = nextConfig

