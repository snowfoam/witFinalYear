const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  },
  productionSourceMap: false,
  devServer: {
    proxy: 'https://localhost:3000'
  }
}
