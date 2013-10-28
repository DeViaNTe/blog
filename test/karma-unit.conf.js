var shared = require('./karma-shared.conf');

module.exports = function(config) {
  shared(config);

  config.files = shared.files.concat([
    'app/assets/app.js',
    'vendor/angular/angular-mocks.js',
    './test/unit/**/*.js'
  ]);
};
