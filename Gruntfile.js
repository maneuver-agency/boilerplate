/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // minify javascript
    uglify: {
      options: {
        beautify: false
      },
      scripts: {
        files: {
          'dist/components.js' : [
            'components/underscore/underscore.js',
            'components/enquire/dist/enquire.min.js',
            'components/bootstrap/js/bootstrap-alert.js'
          ],
          'dist/modernizr.js' : ['scripts/modernizr.js'],
          'dist/main.js' : ['scripts/main.js'],
          'dist/utils.js': ['scripts/utils.js'],
          'dist/polyfills.js': ['scripts/polyfills.js'],
          'dist/application.js': ['scripts/application.js']
        }
      },
      angular: {
        files: {
          'dist/app.js' : [
            'components/angular/angular.js',
            'scripts/angular/angular-local_nl.js',
            'scripts/angular/app.js',
            'scripts/angular/controllers.js',
            'scripts/angular/directives.js',
            'scripts/angular/services.js',
            'scripts/angular/filters.js'
          ]
        },
        options: {
          mangle: false,
          beautify: false
        }
      }
    },

    // preprocess less into css
    less: {
      styles: {
        options: {
          compress: true
        },
        files: {
          'dist/main.css' : ['styles/main.less']
        }
      }
    },

    // optimize images
    imagemin: {
      assets: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'assets/img/',
          src: '**/*',
          dest: 'assets/img/'
        }]
      }
    },

    // check js files
    jshint: {
      options: {
        loopfunc: true,
        expr: true,
        ignores: ['scripts/modernizr.js']
      },
      scripts: ['scripts/*.js', 'scripts/angular/*.js']
    },

    // do stuff when files change
    watch: {
      options: {

      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['default']
      },
      scripts: {
        files: ['scripts/*.js'],
        tasks: ['jshint', 'uglify:scripts']
      },
      angular: {
        files: ['scripts/angular/*.js'],
        tasks: ['jshint', 'uglify:angular']
      },
      styles: {
        files: ['styles/*.less'],
        tasks: ['less']
      }
    },

    modernizr: {
      // devFile : "scripts/modernizr.js",
      outputFile: "dist/modernizr.js",
      tests: [],
      parseFiles: false,
      customTests: []
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-modernizr');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'modernizr']);

};
