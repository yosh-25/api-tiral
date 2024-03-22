import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://en.wikipedia.org', // プロキシ先のベースURL
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '', // /api/proxyを削除してリクエストを転送
  },
  logLevel: 'debug',
});