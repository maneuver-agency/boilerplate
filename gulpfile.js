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
    ,watchify = require('watchify')
    ,source = require('vinyl-source-stream')
    ,buffer = require('vinyl-buffer')
    ,browserSync = require('browser-sync').create()
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
var libs = ['jquery'];

/*****************/
/* DEFAULT TASKS */
/*****************/

gulp.task('default', ['css', 'js', 'img'], function(){});
gulp.task('css', ['editor', 'styles']);
gulp.task('js', ['app', 'libs']);
gulp.task('img', ['imagemin']);

/*********/
/* WATCH */
/*********/

gulp.task('watch', ['watchify'], function(){
  gulp.watch('src/styles/**/*', ['css']);
  // gulp.watch('src/scripts/**/*', ['app']);
  // gulp.watch(imgDir + '/**/*', ['img']);
});

gulp.task('bs-watch', ['watch'], function(){
  browserSync.init({
    proxy: devUrl,
    open: false,
    tunnel: 'mnvr'
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

var bundler = browserify({
    entries: ['src/scripts/main.js'],
    debug: false,
    insertGlobals: false,
    // detectGlobals: false
  })
  .external(libs)
  .transform(babelify, {
    "presets": ["es2015"]
  });
  // .transform(babelify, {
  //   "presets": [
  //     ["env", {
  //       "targets": {
  //         "chrome": 52,
  //         "browsers": ["last 2 versions"]
  //       },
  //       "modules": false,
  //       // "loose": true
  //     }]
  //   ]
  // });

gulp.task('app', function(){
  return bundler
    .bundle()
    .on('error', function (err) {
      gutil.log(gutil.colors.red(err.toString()));
      this.emit("end");
    })
    // .pipe(plumber(function(error) {
    //   gutil.log(gutil.colors.red(error.message));
    //   this.emit('end');
    // }))
    .pipe(source('app.js'))
    .pipe(buffer()) // Create a stream so we can pipe.
    // .pipe(sourcemaps.init())
    .pipe(uglify())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('libs', function(){
  const b = browserify();

  libs.forEach(lib => {
    b.require(lib);
  });

  b.bundle()
  .pipe(source('libs.js'))
  .pipe(buffer())
  // .pipe(uglify())
  .pipe(gulp.dest(outputDir));
});

gulp.task('watchify', function(){
  watchify(bundler)
    .on('update', () => {
      gulp.start('app');
    });

  return gulp.start('app');
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
