'use strict';

require('babel/register');

var babelify = require('babelify');
var browserify = require('browserify');
var del = require('del');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var less = require('gulp-less');
var gls = require('gulp-live-server');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');

gulp.task('clean', function (callback) {
  del('dist', callback);
});

gulp.task('css', ['clean'], function () {
  return gulp.src('./src/less/conway.less')
    .pipe(less({
      plugins: [
        new LessPluginAutoPrefix({browsers: ['last 2 versions']}),
        new LessPluginCleanCSS({advanced: true})
      ]
    }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('html', ['clean'], function () {
  return gulp.src('./src/index.html').pipe(gulp.dest('./dist/'));
});

gulp.task('js', ['clean'], function () {
  return browserify({
    entries: './src/js/conway.js',
    debug: true,
    transform: [babelify]
  }).bundle()
    .pipe(source('conway.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('test', function () {
  return gulp.src([
    'tests/**.test.js'
  ], {read: false})
    .pipe(mocha())
    .on('error', function (err) {
      throw err;
    });
});

gulp.task('watch', function () {
  var server = gls.static('dist');

  server.start();

  gulp.watch([
    'src/**/*.js',
    'src/**/*.html',
    'src/**/*.less'
  ], [
    'default'
  ]);

  gulp.watch([
    'dist/**/*.*'
  ], function () {
    server.notify.apply(server, arguments);
  });
});

gulp.task('default', ['css', 'html', 'js']);
