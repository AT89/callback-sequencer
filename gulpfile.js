(function() {
  'use strict';

  let gulp = require('gulp'),
      del = require('del'),
      concat = require('gulp-concat'),
      jshint = require('gulp-jshint'),
      typescript = require('gulp-typescript'),
      uglify = require('gulp-uglify'),
      connect = require('gulp-connect'),
      scripts = [
        './build/src.js'
      ];

  function clean() {
    return del.sync(['build', 'dist']); 
  }

  function src() {
    return gulp.src('src/main.ts')
      .pipe(typescript({
        noImplicityAny: true,
        out: 'src.js'
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(gulp.dest('build'))
  }

  function main() {
    return gulp.src(scripts)
      .pipe(concat('callback-sequencer.js'))
      .pipe(gulp.dest('dist'))
      .pipe(gulp.dest('demo'));
  }

  function min() {
    return gulp.src(scripts)
      .pipe(uglify({
        mangle: true
      }))
      .pipe(concat('callback-sequencer.min.js'))
      .pipe(gulp.dest('dist'))
      .pipe(gulp.dest('demo'));
  }

  function demo() {
    connect.server({
      port: 9000,
      host: '0.0.0.0',
      root: 'demo',
      livereload: false
    });
  }

  function watch() {
    gulp.watch('src/*.ts', ['main', 'min']);
  }

  gulp.task('clean', clean);
  gulp.task('src', src);
  gulp.task('main', ['src'], main);
  gulp.task('min', ['src'], min);
  gulp.task('demo', demo);
  gulp.task('watch', watch);

  gulp.task('build', ['clean', 'main', 'min']);
  gulp.task('default', ['clean', 'main', 'min', 'demo', 'watch']);
})();
