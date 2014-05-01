var gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    svg2png = require('gulp-svg2png');

// TODO: jshint & imagemin

gulp.watch('styles/**/*.less', ['styles']);
gulp.watch('scripts/**/*.js', ['scripts']);
gulp.watch('assets/img/*.svg', ['svg']);

/* DEFAULT */
gulp.task('default', ['styles', 'scripts'], function(){

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
    }));
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
      // 'bower_components/bootstrap/js/bootstrap-alert.js',
      'bower_components/gmaps/gmaps.js'
    ])
    .pipe(concat('components.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

/* REQUIRE */
gulp.task('require', function(){
  return gulp.src([
      'bower_components/requirejs/require.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

/* MODULES */
gulp.task('modules', function(){
  return gulp.src([
      'scripts/modules/*.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist/modules'));
});

/* SVG 2 PNG */
gulp.task('svg', function(){
  return gulp.src('assets/img')
    .pipe(svg2png())
    .pipe(gulp.dest('assets/img'));
});
