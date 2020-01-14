const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.[contenthash:6].js',
    chunkFilename: '[name].bundle.[contenthash:6].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: process.env.MODE === 'production' ? 'none' : 'inline-sourse-map',
  devServer: {
    open: true,
    port: 3000
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    })
  ]
};
