#!/usr/bin/env bash

rm -rf node_modules
npm i
npm run prepublish
cd gulp
../node_modules/gulp/bin/gulp.js test:ci
cd ../
mkdir -p ../results
mv ./test-results/*.xml ../results
