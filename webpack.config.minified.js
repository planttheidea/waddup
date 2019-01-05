const webpack = require('webpack');
const OptimizeJsPlugin = require('optimize-js-plugin');

const defaultConfig = require('./webpack.config');

module.exports = Object.assign({}, defaultConfig, {
  devtool: undefined,

  mode: 'production',

  output: Object.assign({}, defaultConfig.output, {
    filename: 'waddup.min.js',
  }),

  plugins: defaultConfig.plugins.concat([
    new OptimizeJsPlugin({
      sourceMap: false,
    }),
  ]),
});
