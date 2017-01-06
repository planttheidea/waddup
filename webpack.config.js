const path = require('path');
const webpack = require('webpack');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  cache: false,

  devtool: '#source-map',

  entry: [
    path.resolve(__dirname, 'src', 'index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: true,
    formatter: eslintFriendlyFormatter
  },

  module: {
    preLoaders: [
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel',
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'waddup.js',
    library: 'waddup',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new LodashModuleReplacementPlugin()
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    fallback: [
      path.join(__dirname, 'src')
    ],

    root: __dirname
  }
};