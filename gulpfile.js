var gulp = require('gulp'),
    // less = require('gulp-less'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    svg2png = require('gulp-svg2png'),
    browserSync = require('browser-sync'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    bower = require('bower');

/* WATCH */
// Watch regularly updated files.
gulp.task('watch', function(){
  gulp.watch('styles/**/*.scss', ['styles']);
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('assets/img/*.svg', ['svg']);
});

// Watch regularly updated files + use Browser Sync.
gulp.task('bs-watch', function(){
  browserSync({
    proxy: "boilerplate.local.mnvr.be"
  });

  gulp.watch('styles/**/*.scss', ['styles'])/*.on('change', function(){
    browserSync.reload({stream: true});
  })*/;
  gulp.watch('scripts/**/*.js', ['scripts']).on('change', function(){
    browserSync.reload({once: true});
  });
  gulp.watch('templates/**/*.twig').on('change', function(){
    browserSync.reload({once: true});
  });

  gulp.watch('assets/img/*.svg', ['svg']);
});

/* DEFAULT */
// The whole shabang.
gulp.task('default', ['styles', 'scripts', 'components', 'modules', 'static-scripts', 'svg', 'imagemin'], function(){

});

// Error handler to prevent gulp watch from breaking.
function onError(err) {
  console.log(err.toString());
  this.emit('end');
}

/* STYLES */
// gulp.task('styles', function(){
//   return gulp.src([
//       'styles/main.less'
//     ])
//     .pipe(plumber({errorHandler: notify.onError("Styles Error: <%= error.message %>")}))
//     .pipe(less({
//       paths: ['styles'],
//       compress: true,
//     }))
//     .on('error', onError)
//     .pipe(postcss([autoprefixer({
//       browsers: ['last 3 versions']
//     })]))
//     .pipe(minifycss())
//     .pipe(rename('main.css'))
//     .pipe(gulp.dest('dist'))
//     .pipe(notify({
//       onLast: true,
//       message: 'Styles task completed'
//     }))
//     .pipe(browserSync.reload({stream:true}));
// });

gulp.task('styles', function(){
  gulp.src([
    'styles/main.scss'
  ])
  .pipe(plumber({errorHandler: notify.onError("Sass Error: <%= error.message %>")}))
  .pipe(sass({outputStyle: 'compressed'}))
  .on('error', onError)
  .pipe(postcss([autoprefixer({
    browsers: ['last 3 versions']
  })]))
  .pipe(minifycss())
  .pipe(rename('main.css'))
  .pipe(gulp.dest('dist'))
  .pipe(notify({
    onLast: true,
    message: 'Styles task completed'
  }))
  .pipe(browserSync.reload({stream:true}));
});

/* SCRIPTS */
gulp.task('scripts', ['modules'], function(){
  return gulp.src([
      'scripts/modernizr.js',
      'scripts/main.js',
      'scripts/utils.js',
      'scripts/polyfills.js',
      'scripts/application.js',
    ])
    .pipe(uglify().on('error', function(e) {
      console.log('\x07Message: ',e.message);
      console.log('\x07LineNumber: ',e.lineNumber);
      console.log('\x07Filename: ',e.fileName);
      return this.end();
    }))
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      onLast: true,
      message: 'Scripts task completed'
    }));
});

/* BOWER COMPONENTS */
gulp.task('components', function(){
  return gulp.src([
      'bower_components/picturefill/picturefill.js',
      // 'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
      // 'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
      'bower_components/outdated-browser/outdatedbrowser/outdatedbrowser.js',
      // 'bower_components/gmaps/gmaps.js'
    ])
    .pipe(concat('components.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

/* STATIC SCRIPTS */
gulp.task('static-scripts', function(){
  return gulp.src([
      'bower_components/requirejs/require.js',
      'bower_components/jquery/dist/jquery.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

/* MODULES */
gulp.task('modules', function(){

  // bower.commands.list().on('end', function(results){
  //   if (results.dependencies.flexslider !== undefined) {
  //     gulp.start('flexslider');
  //   }
  // });
  // bower.commands.list().on('end', function(results){
  //   if (results.dependencies.fancybox !== undefined) {
  //     gulp.start('fancybox');
  //   }
  // });

  return gulp.src([
      'scripts/modules/*.js',
      'bower_components/gmaps/gmaps.js',
      'bower_components/requirejs-plugins/src/async.js',
      'bower_components/Google Maps AMD Loader Plugin/src/googlemaps.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist/modules'));
});

/* FLEXSLIDER */
gulp.task('flexslider', function(){
  gulp.src([
    'bower_components/flexslider/jquery.flexslider.js'
  ])
  .pipe(uglify())
  .pipe(rename('flexslider.js'))
  .pipe(gulp.dest('dist/modules'));
});

/* FANCYBOX */
gulp.task('fancybox', function(){
  gulp.src([
    'bower_components/fancybox/source/jquery.fancybox.js'
  ])
  .pipe(uglify())
  .pipe(rename('fancybox.js'))
  .pipe(gulp.dest('dist/modules'));
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
