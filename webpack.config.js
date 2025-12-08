const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    authorization: './src/scripts/authorization.ts',
    script: './src/scripts/script.ts',
    'employee-details': './src/scripts/employee-details.ts',
    '404-not-found': './src/scripts/404-not-found.ts',
    settings: './src/scripts/settings.ts',
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['authorization'],
    }),
    new HtmlWebpackPlugin({
      template: './main.html',
      filename: 'main.html',
      chunks: ['script'],
    }),
    new HtmlWebpackPlugin({
      template: './employee-details.html',
      filename: 'employee-details.html',
      chunks: ['employee-details'],
    }),
    new HtmlWebpackPlugin({
      template: './404-not-found.html',
      filename: '404-not-found.html',
      chunks: ['404-not-found'],
    }),
    new HtmlWebpackPlugin({
      template: './settings.html',
      filename: 'settings.html',
      chunks: ['settings'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'data', to: 'data' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
  },
};
