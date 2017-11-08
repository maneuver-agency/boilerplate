'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const watch = require('gulp-watch')

const cleancss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
// const imagemin = require('gulp-imagemin')


const browserSync = require('browser-sync')
const rsync = require('gulp-rsync')
const argv = require('minimist')(process.argv)
const del = require('del')

const webpack       = require('webpack');
const webpackStream = require('webpack-stream-fixed');

/************/
/* SETTINGS */
/************/

let devUrl = 'boilerplate.local.mnvr.be'
let outputDir = 'dist'
let imgDir = 'assets/img'
let connection = {
  staging: {
    host: 'ssh011.webhosting.be',
    username: 'maneuverbe',
    path: '~/subsites/boilerplate.maneuver.be'
  },
  production: {
    host: 'ssh011.webhosting.be',
    username: 'maneuverbe',
    path: '~/subsites/boilerplate.maneuver.be'
  }
}


/*****************/
/* DEFAULT TASKS */
/*****************/

gulp.task('default', ['fonts', 'css', 'js'], function () {})
gulp.task('css', ['editor', 'styles'])
gulp.task('js', ['webpack'])
// gulp.task('img', ['imagemin'])

/*********/
/* WATCH */
/*********/

gulp.task('dev', ['fonts', 'webpack', 'watch', 'sync'], function () {

})

gulp.task('watch', function () {
  gulp.watch(outputDir + '/*.js').on('change', browserSync.reload);
  gulp.watch('src/scss/**/*', ['css'])
})

gulp.task('sync', function () {
  let options = {
    proxy: devUrl,
    files: [
        '**/*.php'
    ],
    ghostMode: {
        clicks: false,
        location: false,
        forms: false,
        scroll: false
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info',
    logPrefix: 'gulp-patterns',
    notify: false,
    reloadDelay: 0
  };
  browserSync(options);
  // browserSync.init({
  //   proxy: devUrl,
  //   open: false,
  // })

  // gulp.watch('templates/**/*.twig').on('change', function () {
  //   browserSync.reload({once: true})
  // })
})


/***************/
/* PRODUCTION **/
/***************/

gulp.task('production', function() {
    //Setting ENV to production so Webpack will minify JS files. 
    process.env.NODE_ENV = 'production';
    gulp.src('./src/js/app.js')
        .pipe(webpackStream( require('./webpack.config.js'), webpack ))
        .pipe(gulp.dest(outputDir));

    // gulp.src('./dist/css/style.css')
    //     .pipe(csso())
    //     .pipe(gulp.dest('./dist/css'));

    // gulp.src('./dist/css/editor.css')
    //     .pipe(csso())
    //     .pipe(gulp.dest('./dist/css'));
});

/*********/
/* CLEAN */
/*********/

// gulp.task('clean', function () {
//   return del(outputDir)
// })

// gulp.task('clean:js', function () {
//   return del([
//     outputDir + '**/*.js',
//     outputDir + '**/*.js.map'
//   ])
// })

// gulp.task('clean:css', function () {
//   return del([
//     outputDir + '**/*.css',
//     outputDir + '**/*.css.map'
//   ])
// })

/*******/
/* CSS */
/*******/

gulp.task('editor', function () {
  return gulp.src('src/styles/editor.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(outputDir))
})

gulp.task('styles', function () {
  return gulp.src([
    'src/scss/style.scss'
  ])
  .pipe(plumber(function (error) {
    gutil.log(gutil.colors.red(error.message))
    this.emit('end')
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(cleancss())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(outputDir))
  .pipe(browserSync.stream({match: '**/*.css'}))
})

/******/
/* JS */
/******/
gulp.task('webpack', function() {
  return gulp.src('./src/js/app.js')
    .pipe(webpackStream( require('./webpack.config.js'), webpack ))
    .pipe(gulp.dest(outputDir));
})


/*******/
/* IMG */
/*******/

// gulp.task('imagemin', function () {
//   return gulp.src([
//     imgDir + '/*.png',
//     imgDir + '/*.jpg',
//     imgDir + '/*.jpeg',
//     imgDir + '/*.gif'
//   ])
//   .pipe(imagemin())
//   .pipe(gulp.dest(imgDir))
// })


/**********/
/* DEPLOY */
/**********/
gulp.task('deploy', function () {
  var rsyncPaths = [outputDir + '/**/*']
  var rsyncConf = {
    relative: true,
    clean: true,
    recursive: true,
    compress: true,
    silent: true,
    exclude: ['**/*.map']
  }

  if (!argv.production && !argv.staging) {
    throwError('deploy', gutil.colors.red('Missing or invalid target. Use --production or --staging.'))
  }

  var target = argv.production ? 'production' : argv.staging ? 'staging' : ''

  rsyncConf.hostname = connection[target].host
  rsyncConf.username = connection[target].username
  rsyncConf.destination = connection[target].path

  return gulp.src(rsyncPaths)
    .pipe(rsync(rsyncConf))
})


gulp.task('fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(outputDir + '/fonts'))
})

/***********/
/* HELPERS */
/***********/

// This does the same exact thing as .splice(); but, it returns the original
// array reference rather than the collection of items that were deleted.
Array.prototype.spliced = function () {
  // Returns the array of values deleted from array.
  Array.prototype.splice.apply(this, arguments)
  // Return current (mutated) array reference.
  return this
}

function throwError (taskName, msg) {
  throw new gutil.PluginError({
    plugin: taskName,
    message: msg
  })
}
