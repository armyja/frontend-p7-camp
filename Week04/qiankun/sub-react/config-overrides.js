const { name } = require('./package.json');
console.log(name)

module.exports = {
  webpack: function override(config, env) {
    config.entry = config.entry.filter(
      (e) => !e.includes('webpackHotDevClient')
    );

    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    return config;
  },
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.open = false;
      config.hot = false;
      config.headers = {
        'Access-Control-Allow-Origin': '*',
      };
      // Return your customised Webpack Development Server config.
      config.proxy = {
        '/ithome': {
          // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
          target: 'http://127.0.0.1:8099',
          // 允许跨域
          changeOrigin: true,
          ws: true,
          pathRewrite: {
              '^/ithome': ''
          }
        }
      }
      return config;
    };
  },
};
