'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const uglify = require('gulp-uglify')
const cleancss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const browserify = require('browserify')
const babelify = require('babelify')
const watchify = require('watchify')
const exorcist = require('exorcist')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const browserSync = require('browser-sync').create()
const cssimport = require('gulp-cssimport')
const rsync = require('gulp-rsync')
const argv = require('minimist')(process.argv)
const del = require('del')

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
let libs = ['jquery']

/*****************/
/* DEFAULT TASKS */
/*****************/

gulp.task('default', ['css', 'js', 'img'], function () {})
gulp.task('css', ['editor', 'styles'])
gulp.task('js', ['app', 'libs'])
gulp.task('img', ['imagemin'])

/*********/
/* WATCH */
/*********/

gulp.task('watch', ['watchify'], function () {
  gulp.watch('src/styles/**/*', ['css'])
})

gulp.task('bs-watch', ['watch'], function () {
  browserSync.init({
    proxy: devUrl,
    open: false,
    tunnel: devUrl.split('.')[0]
  })

  gulp.watch('templates/**/*.twig').on('change', function () {
    browserSync.reload({once: true})
  })
})

/*********/
/* CLEAN */
/*********/

gulp.task('clean', function () {
  return del(outputDir)
})

gulp.task('clean:js', function () {
  return del([
    outputDir + '**/*.js',
    outputDir + '**/*.js.map'
  ])
})

gulp.task('clean:css', function () {
  return del([
    outputDir + '**/*.css',
    outputDir + '**/*.css.map'
  ])
})

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

/*******/
/* CSS */
/*******/

gulp.task('editor', function () {
  return gulp.src('src/styles/editor.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist'))
})

gulp.task('styles', function () {
  return gulp.src([
    'src/styles/main.scss'
  ])
  .pipe(plumber(function (error) {
    gutil.log(gutil.colors.red(error.message))
    this.emit('end')
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(cssimport())
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(cleancss())
  .pipe(rename('main.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(outputDir))
  .pipe(browserSync.reload({stream: true, match: '**/*.css'}))
})

/******/
/* JS */
/******/

watchify.args.debug = true

let bundler = browserify('src/scripts/main.js', watchify.args)

bundler.external(libs)

bundler.transform(babelify.configure({
  sourceMapRelative: outputDir,
  'presets': ['es2015']
}))

function bundle () {
  gutil.log('Compiling JS...')

  return bundler.bundle()
    .on('error', function (err) {
      gutil.log(err.message)
      browserSync.notify('Browserify Error!')
      this.emit('end')
    })
    .pipe(exorcist(outputDir + '/app.js.map'))
    .pipe(source('app.js'))
    .pipe(buffer()) // Create a stream so we can pipe.
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.stream({once: true}))
}

gulp.task('app', function () {
  return bundle()
})

gulp.task('libs', function () {
  const b = browserify()

  libs.forEach(lib => {
    b.require(lib)
  })

  b.bundle()
  .pipe(source('libs.js'))
  .pipe(buffer())
  .pipe(uglify().on('error', gutil.log))
  .pipe(gulp.dest(outputDir))
})

gulp.task('watchify', function () {
  watchify(bundler).on('update', bundle)
  return bundle()
})

/*******/
/* IMG */
/*******/

gulp.task('imagemin', function () {
  return gulp.src([
    imgDir + '/*.png',
    imgDir + '/*.jpg',
    imgDir + '/*.jpeg',
    imgDir + '/*.gif'
  ])
  .pipe(imagemin())
  .pipe(gulp.dest(imgDir))
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
