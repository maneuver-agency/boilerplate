
const devUrl = 'boilerplate.local.mnvr.be'

const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const path = require('path')


const extractSass = new ExtractTextPlugin({
  filename: "[name].[chunkhash].css",
  // filename: ""
});

module.exports = {
  entry: {
   app: './src/js/app.js',
   vendor: './src/js/vendor.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].[chunkhash].js"
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { modules: false }]
            ]
          }
        }]
      },
      {
        test: /\.(scss)$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: true,
              minimize: true
            }
          }, {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              sourceMap: true
            }
          }]
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      Popper: ['popper.js', 'default']
    }),
    extractSass,
    new ManifestPlugin({
      filter(object) {
        return object.name.indexOf(".map") == -1
      }
    }),
    // new BrowserSyncPlugin({
    //   proxy: devUrl,
    //   port: 3000,
    //   host: 'localhost',
    //   open: false
    // }),
  ]
};