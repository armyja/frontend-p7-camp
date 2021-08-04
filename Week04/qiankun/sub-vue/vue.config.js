const { name } = require('../package.json')

module.exports = {
  publicPath: '/subapp/sub-vue',
  transpileDependencies: ['common'],
  chainWebpack: config => config.resolve.symlinks(false),
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  devServer: {
    port: process.env.VUE_APP_PORT,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
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
  }
}
