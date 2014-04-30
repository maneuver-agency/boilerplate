var gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber');

// TODO: jshint & imagemin

gulp.task('default', ['styles', 'scripts'], function(){

});

gulp.task('styles', function(){
  return gulp.src(['styles/main.less'])
    .pipe(watch())
    .pipe(plumber())
    .pipe(less({
      paths: ['styles'],
      compress: true,
    }))
    .pipe(minifycss())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: 'Styles task completed'}));
});

gulp.task('scripts', ['require', 'components', 'modules'], function(){
  return gulp.src([
      'scripts/modernizr.js',
      'scripts/main.js',
      'scripts/utils.js',
      'scripts/polyfills.js',
      'scripts/application.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: 'Scripts task completed'}));
});

gulp.task('components', function(){
  return gulp.src([
      'bower_components/underscore/underscore.js',
      'bower_components/enquire/dist/enquire.min.js',
      'bower_components/bootstrap/js/bootstrap-alert.js',
      'bower_components/gmaps/gmaps.js'
    ])
    .pipe(concat('components.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('require', function(){
  return gulp.src([
      'bower_components/requirejs/require.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('modules', function(){
  return gulp.src([
      'scripts/modules/*.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('dist/modules'));
});
