//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

var js = require('./js');
var less = require('./less');
var clean = require('./clean');
var watch = require('./watch');
var gulp = require('gulp');
var test = require('./test');

module.exports.devBuild = gulp.series(
  clean.cleanDest,
  js.jsSourceDev,
  js.jsDepsDev,
  js.jsSourceUmd,
  less.build
);


module.exports.dev = gulp.series(
  module.exports.devBuild,
  gulp.parallel(watch, test.continuous)
);
