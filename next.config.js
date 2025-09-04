/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages会部署到子路径，如果你的仓库名不是 username.github.io
  // 需要设置 basePath，请根据你的仓库名修改
  basePath: '/guitarChord',
  assetPrefix: '/guitarChord/',
}

module.exports = nextConfig
