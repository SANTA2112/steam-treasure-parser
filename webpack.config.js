const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'script.js',
    chunkFilename: 'script.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: process.env.MODE === 'production' ? false : 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new webpack.ProgressPlugin(), new CopyPlugin({ patterns: [{ from: 'public', to: '' }] })],
};
