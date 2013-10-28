var shared = function shared(config) {
  config.set({
    basePath: '../',
    frameworks: ['mocha'],
    reporters: ['progress'],
    browsers: ['Firefox'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};

shared.files = [
  'test/mocha.conf.js',
  'node_modules/chai/chai.js',
  'test/lib/chai-should.js',
  'test/lib/chai-expect.js'
];

module.exports = shared;
