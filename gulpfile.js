var gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    svg2png = require('gulp-svg2png'),
    browserSync = require('browser-sync'),
    bower = require('bower');

// TODO: jshint & imagemin

gulp.task('watch', function(){
  gulp.watch('styles/**/*.less', ['styles']);
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('assets/img/*.svg', ['svg']);
});

gulp.task('bs-watch', function(){
  browserSync.init(null, {
    proxy: "prototype.local.mnvr.be"
  });

  gulp.watch('styles/**/*.less', ['styles'])/*.on('change', function(){
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
gulp.task('default', ['styles', 'scripts', 'components', 'static-scripts', 'svg', 'imagemin'], function(){

});

/* MY STYLES */
gulp.task('styles', function(){
  return gulp.src([
      'bower_components/lesshat/build/lesshat-prefixed.less',
      'styles/main.less'
    ])
    .pipe(plumber({errorHandler: notify.onError("Styles Error: <%= error.message %>")}))
    .pipe(less({
      paths: ['styles'],
      compress: true,
    }))
    .pipe(minifycss())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      onLast: true,
      message: 'Styles task completed'
    }))
    .pipe(browserSync.reload({stream:true}));
});

/* MY SCRIPTS */
gulp.task('scripts', ['modules'], function(){
  return gulp.src([
      'scripts/modernizr.js',
      'scripts/main.js',
      'scripts/utils.js',
      'scripts/polyfills.js',
      'scripts/application.js',
    ])
    .pipe(uglify())
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
      'bower_components/bootstrap/js/transition.js',
      'bower_components/bootstrap/js/collapse.js',
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

  bower.commands.list().on('end', function(results){
    if (results.dependencies.flexslider !== undefined) {
      gulp.start('flexslider');
    }
  });

  return gulp.src([
      'scripts/modules/*.js',
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
