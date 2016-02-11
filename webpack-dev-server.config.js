var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  //Entry points to the project
  entry: {
    app:[
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/app.jsx')
    ],
    style:[
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/style.js')
    ]
  },
  //Config options on how to interpret requires imports
  resolve: {
    extensions: ["", ".js", ".jsx",".css",".png",".json"]
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Server Configuration options
  devServer:{
    contentBase: 'src/www',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    proxy: {
      '/asset/*':'http://localhost:3030',
      '/api/*': 'http://localhost:3030'
    },
    port: 3001        //Port Number
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: '[name].js'
  },
  plugins: [
    new ExtractTextPlugin("style.css", { allChunks: true }),
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Moves files
    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname, "src"))
  ],
  module: {
    loaders: [
      { 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.(png|jpg|json|ttf|svg|woff|woff2|eot)(\?v=\d\.\d\.\d)?$/, 
        loader: 'url-loader?limit=8192'
      }, 
      {
        test: /\.(js|jsx)$/,  //All .js and .jsx files
        loaders: ['react-hot','babel-loader?optional=runtime&stage=0'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      }
    ]
  }
};

module.exports = config;
