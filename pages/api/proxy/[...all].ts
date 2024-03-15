import { createProxyMiddleware } from 'http-proxy-middleware';

const wikipediaProxy = createProxyMiddleware({
  target: 'https://en.wikipedia.org', // プロキシ先のベースURL
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy/wikipedia': '', // /api/proxyを削除してリクエストを転送
  },
  logLevel: 'debug',
});

const freeDictionaryProxy = createProxyMiddleware({
    target: 'https://api.dictionaryapi.dev', // プロキシ先のベースURL
    changeOrigin: true,
    pathRewrite: {
      '^/api/proxy/dictionary': '', // /api/proxyを削除してリクエストを転送
    },
    logLevel: 'debug',
  });

  export default function (req, res) {
    if (req.url.startWith('api/proxy/wikipedia')) {
        return wikipediaProxy(req, res);
    }
    if (req.url.startWith('api/proxy/dictionaryapi')) {
        return freeDictionaryProxy(req, res);
    }

  }

//   from here , to solve the errors
