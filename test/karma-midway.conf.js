var shared = require('./karma-shared.conf');

module.exports = function(config) {
  shared(config);

  config.files = shared.files.concat([
    'vendor/yearofmoo/ngMidwayTester.js',
    'app/assets/*.js',
    'test/midway/**/*.js'
  ]);
};
