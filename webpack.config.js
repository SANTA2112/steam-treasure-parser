const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'script.js',
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
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin({ patterns: [{ from: 'public', to: '' }] }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
