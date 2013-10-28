var path      = require('path');
var fs        = require('fs');
var spawn     = require('child_process').spawn;

function startWatcher() {
  var watch  = spawn('grunt', ['watch']);
  watch.on('close', function(code, signal) { console.log("[WATCH] Closed " + code); });
  watch.stdout.on('data', function(data) { process.stdout.write(data); });
  watch.stderr.on('data', function(data) { process.stderr.write(data); });
}

module.exports = function exports(grunt) {
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    /* server */
    connect: {
      options: {
        mode: 'dist',
        port: 8000,
        base: './dist',
        middleware: function(connect, options) {
          if (options.mode === 'devel') { startWatcher(); }
          var middlewares = [];
          var directory = options.directory || options.base[options.base.length - 1];
          if (!Array.isArray(options.base)) { options.base = [options.base]; }
          options.base.forEach(function(base) { middlewares.push(connect.static(base)); middlewares.push(connect.static(base+"/assets")); middlewares.push(connect.static(base+"/assets/img")); });
          middlewares.push(function(req,res){
            console.log("Not found "+req.url);
            res.writeHead(302, { 'Location': '/#!' + req.url }); res.end(''); });
          return middlewares;
        }
      },
      dist: {
        options: {
          mode: 'dist',
          open: true,
          keepalive: true
        }
      },
      devel: {
        options: {
          mode: 'devel',
          base: './app',
          open: true,
          keepalive: true
        }
      },
      test: {

      }
    },

    /* testing */
    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js'
      },
      midway: {
        configFile: './test/karma-midway.conf.js',
        autoWatch: false,
        singleRun: true
      },
      midway_auto: {
        configFile: './test/karma-midway.conf.js'
      },
      e2e: {
        configFile: './test/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e_auto: {
        configFile: './test/karma-e2e.conf.js'
      }
    },

    /* shell commands */
    shell: {
      compass: { command: 'compass compile' },
      sublime: { command: 'sublime-text blog.sublime-project' },
      emulate: { command: ['emulator @GalaxyAce', '(cd spotlio-business-phonegap && phonegap run android --emulator)'].join('&'), options: {stdout: true} },
      device: { command: ['(cd spotlio-business-phonegap && phonegap run android --device)'].join('&'), options: {stdout: true} },
      emudev: { command: ['(cd spotlio-business-phonegap && phonegap run android --device --emulator)'].join('&'), options: {stdout: true} }
    },

    /* watchs */
    watch: {
      app: {
        files: ['src/**/*', 'src/*'],
        tasks: ['build:devel'],
        options: {
          nospawn: false
        }
      },
      live: {
        files: ['./app/index.html'],
        options: {
          livereload: 35729,
          nospawn: true
        }
      }
    },

    /* build */
    build: {
      dist: {
        layout: './src/html/index.html',
        dest: './dist',
        css: { temp: './.css-cache/', output: 'compressed' },
        compress: true
      },
      devel: {
        layout: './src/html/index.html',
        dest: './app',
        css: { temp: './.css-cache/', output: 'expanded' },
        compress: false
      }
    },

    /* copy */
    copy: {
      dist: {
        files: [
          { expand: true, cwd: './src/', src: ['fonts/*'], dest: './dist/assets'},
          { expand: true, cwd: './vendor/bootstrap/', src: ['fonts/*'], dest: './dist/assets' },
          { expand: true, cwd: './src/', src: ['img/*'], dest: './dist/assets' },
          //{ expand: true, cwd: './dist', src: ['**/*', '*'], dest: './spotlio-business-phonegap/www' }
        ]
      },
      devel: {
        files: [
          { expand: true, cwd: './src/', src: ['fonts/*'], dest: './app/assets'},
          { expand: true, cwd: './vendor/bootstrap/', src: ['fonts/*'], dest: './app/assets' },
          { expand: true, cwd: './src/', src: ['img/*'], dest: './app/assets' }
        ]
      }
    }
  });

  grunt.task.registerMultiTask('build', 'description', require('./Gruntworker.js')(grunt));

  grunt.registerTask('devel', ['build:devel', 'copy:devel', 'connect:devel']);
  grunt.registerTask('dist', ['build:dist', 'copy:dist']);
  //grunt.registerTask('emu', ['dist', 'shell:emulate']);
  //grunt.registerTask('run', ['shell:emulate']);
  //grunt.registerTask('device', ['dist', 'shell:device']);
  //grunt.registerTask('emudev', ['dist', 'shell:emudev']);

  // keep these for testing:
  //grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
  grunt.registerTask('test', ['karma:unit', 'karma:midway'/*, 'test:e2e'*/]);
  //keeping these around for legacy use
  //grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  //grunt.registerTask('autotest:midway', ['karma:midway_auto']);
  //grunt.registerTask('autotest:e2e', ['karma:e2e_auto']);
  //grunt.registerTask('autotest', ['karma:unit_auto']);

  grunt.registerTask('default', ['devel']);
};