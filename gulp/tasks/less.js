var gulp = require('gulp');
var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new LessPluginCleanCSS({ advanced: true });
var sourcemaps = require('gulp-sourcemaps');

module.exports.paths = [
  'source/**/*.less'
];

module.exports.build = function buildCss () {
  return gulp.src(module.exports.paths, {
    since: gulp.lastRun(buildCss),
    base: '.'
  })
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: 'node_modules/bootstrap/less/',
      plugins: [cleancss]
    }))
    .pipe(sourcemaps.write({ sourceRoot: '' }))
    .pipe(gulp.dest('./dest'));
};
