/**
 * TODO:
 * - parse editor.scss file to seperate css file
 * - minify and uglify all assets in production
 * - speed up the process for development
 */

const settings = require('./app.config.js')
const Encore = require('@symfony/webpack-encore')

Encore

// the project directory where all compiled assets will be stored
  .setOutputPath(settings.outputDir + '/')

// the public path used by the web server to access the previous directory
  .setPublicPath('/' + settings.outputDir)

// will create web/build/app.js and web/build/app.css
  .addEntry('app', './src/js/app.js')

  .configureExtractTextPlugin((options) => {
    options.disable = !Encore.isProduction()
  })

  .enableVueLoader()

// allow sass/scss files to be processed
  .enableSassLoader(function (sassOptions) {}, {
    resolveUrlLoader: false
  })

// allow legacy applications to use $/jQuery as a global variable
  .autoProvidejQuery()

// make sure 'Popper' exists for bootstrap
  .autoProvideVariables({
    Popper: ['popper.js']
  })

  .enableSourceMaps(!Encore.isProduction())

// empty the outputPath dir before each build
  .cleanupOutputBeforeBuild()

// create a vendor js file with common code that rarely changes
  .createSharedEntry('vendor', [
    'jquery',
    'popper.js',
    'bootstrap'
  ])

if (Encore.isProduction()) {
  Encore
  // See postcss.config.js for configuration
  // .enablePostCssLoader()

  // create hashed filenames (e.g. app.abc123.css)
    .enableVersioning()
}

let config = Encore.getWebpackConfig()

/**
 * Setup BrowserSync which is not yet supported out-of-the-box.
 * @see https://github.com/symfony/webpack-encore/issues/2
 */
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
config.plugins.push(new BrowserSyncPlugin(
  {
    proxy: settings.devUrl, // coming from some settings variables
    host: 'localhost',
    port: 3000,
    files: [ // watching on changes
      {
        match: [
          './**/*.twig'
        ],
        fn: function (event, file) {
          if (event === 'change') {
            // get the named instance
            const bs = require('browser-sync').get('bs-webpack-plugin')
            bs.reload()
          }
        }
      }
    ],
    injectChanges: true
  },
  {
    reload: false, // this allow webpack server to take care of instead browser sync
    name: 'bs-webpack-plugin' // notice the name when getting instance above
  }
))

// export the final configuration
module.exports = config
