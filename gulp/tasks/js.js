//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

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
