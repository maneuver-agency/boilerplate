var argv = require('yargs').argv
    ,gulp = require('gulp')
    ,gutil = require('gulp-util')
    ,gulpif = require('gulp-if')
    ,sass = require('gulp-sass')
    ,minifycss = require('gulp-minify-css')
    ,uglify = require('gulp-uglify')
    ,rename = require('gulp-rename')
    ,concat = require('gulp-concat')
    ,plumber = require('gulp-plumber')
    ,imagemin = require('gulp-imagemin')
    ,svg2png = require('gulp-svg2png')
    ,browserSync = require('browser-sync')
    ,sourcemaps = require('gulp-sourcemaps')
    ,autoprefixer = require('gulp-autoprefixer')
    ,browserify = require('browserify')
    ,watchify = require('watchify')
    ,source = require('vinyl-source-stream')
    ,buffer = require('vinyl-buffer')
    ;

var outputDir = 'dist';

/* WATCH */
// Watch regularly updated files.
gulp.task('watch', ['watchify'], function(){
  gulp.watch('styles/**/*.scss', ['styles']);
  // gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('assets/img/*.svg', ['svg']);
});

// Watch regularly updated files + use Browser Sync.
gulp.task('bs-watch', ['watchify'], function(){
  browserSync({
    proxy: "boilerplate.local.mnvr.be"
  });

  gulp.watch('styles/**/*.scss', ['styles'])/*.on('change', function(){
    browserSync.reload({stream: true});
  })*/;
  // gulp.watch('scripts/**/*.js', ['watchify']).on('change', function(){
  //   browserSync.reload({once: true});
  // });
  gulp.watch('templates/**/*.twig').on('change', function(){
    browserSync.reload({once: true});
  });

  gulp.watch('assets/img/*.svg', ['svg']);
});

/* DEFAULT */
// The whole shabang.
gulp.task('default', ['styles', 'scripts', 'build', 'svg', 'imagemin'], function(){

});

// Error handler to prevent gulp watch from breaking.
function onError(err) {
  console.log(err.toString());
  this.emit('end');
}

/* STYLES */
gulp.task('styles', function(){
  gulp.src([
    'styles/main.scss'
  ])
  .pipe(plumber({errorHandler: gutil.log.bind(gutil, 'Sass Error')}))
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}))
  .on('error', onError)
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(minifycss())
  .pipe(sourcemaps.write())
  .pipe(rename('main.css'))
  .pipe(gulp.dest(outputDir))
  .pipe(browserSync.reload({stream:true}));
});

/* SCRIPTS */
gulp.task('scripts', function(){
  return gulp.src([
    'scripts/modernizr.js',
  ])
  .pipe(uglify())
  .pipe(gulp.dest(outputDir));
});

/* BROWSERIFY */
var bundler = browserify({
  entries: ['scripts/main.js'],
  // transform: [reactify],
  // extensions: ['.jsx'],
  debug: !argv.production,
  cache: {},
  packageCache: {},
  fullPaths: true // for watchify
});

gulp.task('build', function(){
  // https://coderwall.com/p/zpquzq/gulpfile-for-projects-with-less-browserify-and-react
  return bundler
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(gulpif(!argv.production, sourcemaps.init({loadMaps: true}))) // loads map from browserify file
  .pipe(gulpif(!argv.production, sourcemaps.write('./'))) // writes .map file
  .pipe(gulpif(argv.production, uglify()))
  .pipe(gulp.dest(outputDir));
});

gulp.task('watchify', function() {
  var watcher = watchify(bundler);
  return watcher
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .on('update', function () {
      watcher.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest(outputDir))
      .pipe(browserSync.reload({stream:true}));

      gutil.log("Updated JavaScript sources");
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(outputDir));
});

/* SVG 2 PNG */
gulp.task('svg', function(){
  return gulp.src('assets/img/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('assets/img'));
});

/* IMAGEMIN */
gulp.task('imagemin', function(){
  return gulp.src([
    'assets/img/*.png',
    'assets/img/*.jpg',
    'assets/img/*.jpeg',
    'assets/img/*.gif'
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img'));
});
