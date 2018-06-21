'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;

module.exports = function makeWebpackConfig() {
  var config = {};

  config.entry = {
    app: './src/app/app.js'
  };

  config.output = {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  };

  config.devtool = 'eval-source-map';
  
  config.module = {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          {loader: 'css-loader', query: {sourceMap: true}},
          {loader: 'postcss-loader'}
        ],
      })
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file-loader'
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  };

  /**
   * PostCSS
   * Add vendor prefixes to your css
   */
   // NOTE: This is handled in the `postcss.config.js`
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    })
  ];
  
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      inject: 'body'
    }),
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({filename: 'css/[name].css', disable: true, allChunks: true})
  )

  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal',
    host: '0.0.0.0'
  };

  return config;
}();
