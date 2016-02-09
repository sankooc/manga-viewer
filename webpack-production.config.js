var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    app:  path.join(__dirname, '/src/app/app.jsx'),
    style:path.join(__dirname, '/src/app/style.js')
  },
  resolve: {
    extensions: ["", ".js", ".jsx",".css",".png",".json"]
  },
  devtool: 'source-map',
  output: {
    path: buildPath, 
    filename: '[name].js'
  },
  plugins: [
    new ExtractTextPlugin("style.css", { allChunks: true }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname,"src"))
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/, //All .js and .jsx files
        loader: 'babel-loader?optional=runtime&stage=0', //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.(png|jpg|json|ttf|svg|woff|woff2|eot)$/, 
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};

module.exports = config;
