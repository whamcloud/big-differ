//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

var Server = require('karma').Server;

function runServer (options) {
  return function runner (done) {
    new Server(Object.assign({
      configFile: process.cwd() + '/karma.conf.js'
    }, options), done)
      .start();
  };
}

module.exports.continuous = runServer({});
module.exports.once = runServer({
  singleRun: true
});
module.exports.ci = runServer({
  singleRun: true,
  reporters: ['dots', 'junit']
});
