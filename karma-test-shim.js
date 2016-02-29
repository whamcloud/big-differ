// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
window.__karma__.loaded = function () {};

var pathRecords = Object.keys(window.__karma__.files)
  .filter(onlyAppFiles)
  .reduce(function createPathRecords (pathsMapping, appPath) {
    // creates local module name mapping to global path with karma's fingerprint in path, e.g.:
    // './hero.service': '/base/src/app/hero.service.js?f4523daf879cfb7310ef6242682ccf10b2041b3e'
    var moduleName = appPath.replace(/^\/base\/src\/app\//, './').replace(/\.js$/, '');

    pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath];
    return pathsMapping;
  }, {});

System.config({
  packages: {
    'base/dest/': {
      meta: {
        'node_modules/angular-mocks/ngMock.js': {
          deps: ['angular']
        },
        'node_modules/angular-ui-bootstrap/index.js': {
          deps: ['angular']
        }
      },
      defaultExtension: 'js',
      map: Object.assign(pathRecords, {
        angular: 'base/dest/node_modules/angular/index.js',
        'angular/angular': 'base/dest/node_modules/angular/angular.js',
        'angular-mocks': 'base/dest/node_modules/angular-mocks/ngMock.js',
        'angular-mocks/angular-mocks': 'base/dest/node_modules/angular-mocks/angular-mocks.js',
        'angular-ui-bootstrap': 'base/dest/node_modules/angular-ui-bootstrap/index.js',
        'ui-bootstrap-tpls': 'base/dest/node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js'
      })
    }
  }
});

System.import('/base/dest/node_modules/intel-jasmine-n-matchers/jasmine-n-matchers')
.then(function () {
  return Promise.all(
    Object.keys(window.__karma__.files)
    .filter(onlySpecFiles)
    .map(function (moduleName) {
      // loads all spec files via their global module names (e.g. 'base/src/app/hero.service.spec')
      return System.import(moduleName);
    }));
})
.then(function () {
  window.__karma__.start();
}, function (error) {
  window.__karma__.error(error.stack || error);
});

function onlyAppFiles (filePath) {
  return /^\/base\/dest\/source\/.*\.js$/.test(filePath) &&
  !/^\/base\/dest\/source\/.*\.unit\.js$/.test(filePath);
}


function onlySpecFiles (filePath) {
  return /^\/base\/dest\/source\/.*\.unit\.js$/.test(filePath) ||
  /^\/base\/dest\/source\/.*\.integration\.js$/.test(filePath);
}
