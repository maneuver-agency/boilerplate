const Encore = require('@symfony/webpack-encore')

Encore
    // the project directory where all compiled assets will be stored
    .setOutputPath('dist/')

    // the public path used by the web server to access the previous directory
    .setPublicPath('/dist')

    // will create web/build/app.js and web/build/app.css
    .addEntry('app', './src/js/app.js')
    .addStyleEntry('core', './src/scss/core.scss')

    .enableVueLoader()

    // allow sass/scss files to be processed
    .enableSassLoader(function(sassOptions) {}, {
      resolveUrlLoader: false
    })

    // See postcss.config.js for configuration
    .enablePostCssLoader()

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
      'bootstrap',
    ])

    // create hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

let config = Encore.getWebpackConfig()

/**
 * Setup BrowserSync which is not yet supported out-of-the-box.
 * @see https://github.com/symfony/webpack-encore/issues/2
 */
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
config.plugins.push(new BrowserSyncPlugin(
    {
        proxy: 'http://boilerplate.local.mnvr.be', // coming from some settings variables
        host: 'localhost',
        port: 3000,
        files: [ // watching on changes
            {
                match: [
                    './dist/*.css'
                ],
                fn: function (event, file) {
                    if (event === 'change') {
                        // get the named instance
                        const bs = require('browser-sync').get('bs-webpack-plugin');
                        bs.reload('*.css');
                    }
                }
            },
            {
                match: [
                    './**/*.twig'
                ],
                fn: function (event, file) {
                    if (event === 'change') {
                        // get the named instance
                        const bs = require('browser-sync').get('bs-webpack-plugin');
                        bs.reload();
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
));

/**
 * Add plugin to write the css file to disk when using webpack-dev-server to 
 * utilize browsersync.
 */
const WriteFilePlugin = require('write-file-webpack-plugin')
config.plugins.push(new WriteFilePlugin({
    test: /\.css$/,
    useHashIndex: true
}))

// export the final configuration
module.exports = config

