const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
}

const PAGES_DIR = `${PATHS.src}/pug/pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug'))

module.exports = () => {

  // Setting loaders styles
  function getStyleLoaders() {
    if (isProd) {
      return [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    } else {
      return ['style-loader', 'css-loader', 'sass-loader']
    }
  }
  // Setting the plugins used
  function getPlugins() {
    const plugins = [
      ...PAGES.map(page => new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`
      })),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: '[name].css'
      }));
    }

    return plugins;
  }

  return {
    mode: 'development',
    entry: './src/index.ts',
    output: {
      filename: 'index.js'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        // loading TypeScript filters
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        // loading PUG
        {
          test: /\.pug$/,
          loader: 'pug-loader'
        },
        // loading SCSS, SASS
        {
          test: /\.s[ac]ss$/,
          use: getStyleLoaders(),
        },
      ]
    },
    plugins: getPlugins(),
  }
}