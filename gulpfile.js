var gulp = require('gulp')
    ,gutil = require('gulp-util')
    ,sourcemaps = require('gulp-sourcemaps')
    ,sass = require('gulp-sass')
    ,gulpif = require('gulp-if')
    ,plumber = require('gulp-plumber')
    ,uglify = require('gulp-uglify')
    ,autoprefixer = require('gulp-autoprefixer')
    ,imagemin = require('gulp-imagemin')
    ,rename = require('gulp-rename')
    ,browserify = require('browserify')
    ,babelify = require('babelify')
    ,source = require('vinyl-source-stream')
    ,buffer = require('vinyl-buffer')
    ,browserSync = require('browser-sync')
    ,importCss = require('gulp-import-css')
    ;

/************/
/* SETTINGS */
/************/

var devUrl = 'boilerplate.local.mnvr.be';
var productionEnv = 'prod';
var outputDir = 'dist';
var imgDir = 'assets/img';
var isProd = function(){ return gutil.env.env == productionEnv };
var filename = function(name) { return isProd() ? name.split('.').spliced(-1, 0, 'min').join('.') : name; }

/*****************/
/* DEFAULT TASKS */
/*****************/

gulp.task('default', ['css', 'js', 'img'], function(){});
gulp.task('css', ['editor', 'styles']);
gulp.task('js', ['browserify']);
gulp.task('img', ['imagemin']);

/*********/
/* WATCH */
/*********/

gulp.task('watch', [], function(){
  gulp.watch('src/styles/**/*', ['css']);
  gulp.watch('src/scripts/**/*', ['js']);
  gulp.watch(imgDir + '/**/*', ['img']);
});

gulp.task('bs-watch', ['watch'], function(){
  browserSync.init({
    proxy: devUrl
  });

  gulp.watch('templates/**/*.twig').on('change', function(){
    browserSync.reload({once: true});
  });
});

/**********/
/* DEPLOY */
/**********/

gulp.task('deploy', function(){
  let rsyncPaths = [outputDir];
  let rsyncConf = {
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: [],
  };

  rsyncConf.hostname = 'ssh011.webhosting.be';
  rsyncConf.username = 'maneuverbe';
  rsyncConf.destination = '~/subsites/boilerplate.maneuver.be';

  return gulp.src(rsyncPaths)
  // .pipe(gulpif(
  //     argv.production,
  //     prompt.confirm({
  //       message: 'Heads Up! Are you SURE you want to push to PRODUCTION?',
  //       default: false
  //     })
  // ))
  .pipe(rsync(rsyncConf));
});

/*******/
/* CSS */
/*******/

gulp.task('editor', function(){
  gulp.src('src/styles/editor.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function(){
  gulp.src([
    'src/styles/main.scss'
  ])
  .pipe(plumber(function(error) {
    gutil.log(gutil.colors.red(error.message));
    this.emit('end');
  }))
  .pipe(gulpif(!isProd(), sourcemaps.init()))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(importCss())
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(gulpif(!isProd(), sourcemaps.write()))
  .pipe(rename(filename('main.css')))
  .pipe(gulp.dest(outputDir))
  .pipe(browserSync.reload({stream:true}));
});

/******/
/* JS */
/******/

gulp.task('browserify', function(){
  return browserify({ entries: ['src/scripts/main.js'] })
    .transform(babelify, {presets: ["latest"]})
    .bundle()
    .on('error', function(error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    })
    .pipe(source(filename('bundle.js')))
    .pipe(buffer()) // Create a stream so we can pipe.
    .pipe(gulpif(!isProd(), sourcemaps.init({loadMaps:true})))
    .pipe(gulpif(!isProd(), sourcemaps.write('./')))
    .pipe(gulpif(isProd(), uglify()))
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.reload({stream:true}));
});

/*******/
/* IMG */
/*******/

gulp.task('imagemin', function(){
  return gulp.src([
    imgDir + '/*.png',
    imgDir + '/*.jpg',
    imgDir + '/*.jpeg',
    imgDir + '/*.gif'
    ])
    .pipe(imagemin())
    .pipe(gulp.dest(imgDir));
});

/***********/
/* HELPERS */
/***********/

// This does the same exact thing as .splice(); but, it returns the original
// array reference rather than the collection of items that were deleted.
Array.prototype.spliced = function() {
  // Returns the array of values deleted from array.
  Array.prototype.splice.apply( this, arguments );
  // Return current (mutated) array reference.
  return( this );
};
