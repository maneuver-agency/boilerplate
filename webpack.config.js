
const path            = require('path');
const webpack         = require('webpack');
const UglifyJSPlugin  = require('uglifyjs-webpack-plugin');

const config = {
  watch: true,
  entry: {
    app: './src/js/app.js',
    vendor: ['vue', 'bootstrap']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
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
    ]
  },
  resolve: {
    extensions: ['.js'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
  ]
};

//If true JS files will be minified
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new UglifyJSPlugin({
      compress: false,
      ecma: 6
    })
  );
  config.watch = false;
}

module.exports = config;


// const devUrl = 'boilerplate.local.mnvr.be'

// const webpack = require('webpack')
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// // const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
// const ManifestPlugin = require('webpack-manifest-plugin')
// const WriteFilePlugin = require('write-file-webpack-plugin')
// const path = require('path')


// const extractSass = new ExtractTextPlugin({
//   // filename: "[name].[hash].css",
//   filename: "[name].css",
//   // filename: ""
// });

// module.exports = {
//   entry: {
//    app: './src/js/app.js',
//    vendor: './src/js/vendor.js'
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     // filename: "[name].[hash].js",
//     filename: "[name].js",
//     publicPath: 'http://boilerplate.local.mnvr.be/dist/'
//   },
//   devtool: 'source-map',
//   devServer: {
//     hot: true, // this enables hot reload
//     inline: true, // use inline method for hmr 
//     host: "localhost",
//     port: 8080,
//     headers: { 'Access-Control-Allow-Origin': '*' }
//     // contentBase: path.join(__dirname, "/"),
//     // watchOptions: {
//     //   poll: false // needed for homestead/vagrant setup
//     // }
//   },
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader',
//         options: {
//           loaders: {
//           }
//           // other vue-loader options go here
//         }
//       },
//       {
//         test: /\.js$/,
//         include: path.resolve(__dirname, 'src'),
//         use: [{
//           loader: 'babel-loader',
//           options: {
//             presets: [
//               ['es2015', { modules: false }]
//             ]
//           }
//         }]
//       },
//       {
//         test: /\.(scss)$/,
//         use: ['css-hot-loader'].concat(extractSass.extract({
//           fallback: 'style-loader',
//           //resolve-url-loader may be chained before sass-loader if necessary
//           use: [{
//             loader: "css-loader", // translates CSS into CommonJS
//             options: {
//               sourceMap: true,
//               minimize: true
//             }
//           }, {
//             loader: "sass-loader", // compiles Sass to CSS
//             options: {
//               sourceMap: true
//             }
//           }]
//         }))
//       }
//     ]
//   },
//   plugins: [
//     new CleanWebpackPlugin(['dist']),
//     new webpack.ProvidePlugin({
//       $: "jquery",
//       jQuery: "jquery",
//       Popper: ['popper.js', 'default']
//     }),
//     extractSass,
//     new ManifestPlugin({
//       filter(object) {
//         return object.name.indexOf(".map") == -1
//       },
//       //publicPath: 'http://localhost:8080/dist/',
//       publicPath: '/dist/',
//     }),
//     new webpack.NamedModulesPlugin(),
//     new webpack.HotModuleReplacementPlugin(),
//     new WriteFilePlugin()

//     // new BrowserSyncPlugin({
//     //   proxy: devUrl,
//     //   port: 3000,
//     //   host: 'localhost',
//     //   open: false
//     // }),
//   ]
// };