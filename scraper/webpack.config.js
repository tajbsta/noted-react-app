const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const version = JSON.stringify(require('./package.json').version);
const METADATA = `/*
  Noted Scraper ${version}
*/
`

module.exports = {
  mode: 'production',
  entry: {
    index: path.join(__dirname, 'src', 'index.ts'),
  },
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'scraper.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.coffee', '.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            beautify: false,
            preamble: METADATA
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ]
}
