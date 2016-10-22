var gulp = require('gulp')
    ,gutil = require('gulp-util')
    ,sourcemaps = require('gulp-sourcemaps')
    ,sass = require('gulp-sass')
    ,plumber = require('gulp-plumber')
    ,uglify = require('gulp-uglify')
    ,cleancss = require('gulp-clean-css')
    ,autoprefixer = require('gulp-autoprefixer')
    ,imagemin = require('gulp-imagemin')
    ,rename = require('gulp-rename')
    ,browserify = require('browserify')
    ,babelify = require('babelify')
    ,source = require('vinyl-source-stream')
    ,buffer = require('vinyl-buffer')
    ,browserSync = require('browser-sync')
    ,cssimport = require("gulp-cssimport")
    ,rsync = require('gulp-rsync')
    ,argv = require('minimist')(process.argv)
    ;

/************/
/* SETTINGS */
/************/

var devUrl = 'boilerplate.local.mnvr.be';
var outputDir = 'dist';
var imgDir = 'assets/img';
var connection = {
  staging: {
    host: 'ssh011.webhosting.be',
    username: 'maneuverbe',
    path: '~/subsites/boilerplate.maneuver.be',
  },
  production: {
    host: 'ssh011.webhosting.be',
    username: 'maneuverbe',
    path: '~/subsites/boilerplate.maneuver.be'
  }
};

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
  var rsyncPaths = [outputDir];
  var rsyncConf = {
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: ['*.map'],
  };

  if (!argv.production && !argv.staging) {
    throwError('deploy', gutil.colors.red('Missing or invalid target. Use --production or --staging.'));
  }

  var target = argv.production ? 'production' : argv.staging ? 'staging' : '';

  rsyncConf.hostname = connection[target].host;
  rsyncConf.username = connection[target].username;
  rsyncConf.destination = connection[target].path;

  return gulp.src(rsyncPaths)
  .pipe(rsync(rsyncConf));
});

/*******/
/* CSS */
/*******/

gulp.task('editor', function(){
  return gulp.src('src/styles/editor.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function(){
  return gulp.src([
    'src/styles/main.scss'
  ])
  .pipe(plumber(function(error) {
    gutil.log(gutil.colors.red(error.message));
    this.emit('end');
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(cleancss())
  .pipe(rename('main.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(cssimport())
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
    .pipe(source('bundle.js'))
    .pipe(buffer()) // Create a stream so we can pipe.
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(uglify())
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

function throwError(taskName, msg) {
  throw new gutil.PluginError({
    plugin: taskName,
    message: msg
  });
}
