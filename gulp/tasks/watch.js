//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

var js = require('./js');
var gulp = require('gulp');

module.exports = function watch () {
  gulp.watch(js.paths.source, js.jsSourceDev);
  gulp.watch(js.paths.deps, js.jsDepsDev);
};
