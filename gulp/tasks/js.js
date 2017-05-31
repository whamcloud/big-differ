//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

var gulp = require('gulp');
var babel = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');


exports.paths = {
  source: 'source/**/*.js',
  deps: [
    'node_modules*/intel-jasmine-n-matchers/jasmine-n-matchers.js',
    'node_modules*/angular/angular.js',
    'node_modules*/angular/index.js',
    'node_modules*/angular-mocks/angular-mocks.js',
    'node_modules*/angular-mocks/ngMock.js',
    'node_modules*/angular-ui-bootstrap/index.js',
    'node_modules*/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
  ]
};

function jsSource (fn) {
  return gulp.src(exports.paths.source, {
    since: gulp.lastRun(fn),
    base: '.'
  })
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015'],
    babelrc: false,
    plugins: [
      'transform-flow-strip-types',
      'transform-strict-mode',
      'transform-es2015-modules-systemjs',
      'transform-class-properties'
    ]
  }))
  .pipe(ngAnnotate({
    single_quotes: true
  }))
  .pipe(sourcemaps.write({ sourceRoot: '' }));
}

exports.jsSourceUmd = function jsSourceUmd (fn) {
  return gulp.src([exports.paths.source, '!source/**/*.unit.js'], {
    since: gulp.lastRun(fn),
    base: '.'
  })
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015'],
    babelrc: false,
    plugins: [
      'transform-flow-strip-types',
      'transform-strict-mode',
      'transform-es2015-modules-umd',
      'transform-class-properties'
    ]
  }))
  .pipe(ngAnnotate({
    single_quotes: true
  }))
  .pipe(sourcemaps.write({ sourceRoot: '' }))
  .pipe(gulp.dest('./dest/umd'));
};

exports.jsSourceDev = function jsSourceDev () {
  return jsSource(jsSourceDev)
    .pipe(gulp.dest('./dest'));
};

exports.jsDepsDev = function jsDepsDev () {
  return gulp.src(exports.paths.deps, {
    since: gulp.lastRun(jsDepsDev),
    base: '.'
  })
  .pipe(gulp.dest('./dest'));
};
