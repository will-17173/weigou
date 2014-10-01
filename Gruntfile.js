module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true,
          hostname: '*'
        }
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! \n<%= pkg.name %>-<%= pkg.version %> \nDescription: <%= pkg.description %>\nAuthor: <%= pkg.author %>\nDate: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> \n*/\n',
        separator: ';'
      },
      dist: {
        src: ['dist/js/min/*.js'],
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/* \nAuthor: <%= pkg.author %>\nDate: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> \n*/\n',
        footer:'\n',
        beautify: {
          ascii_only: true
        },
        compress: {
          global_defs: {
            'DEBUG': false
          },
          dead_code: true
        },
        compress: {
          drop_console: true
        }
      },
      dist: {
        files: [{
            expand: true,
            cwd: 'src/js',
            src: '*.js',
            dest: 'dist/js/min'
        }]
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['src/**/*.js'],
      options: {
        "jshintrc": ".jshintrc"
      }
    },
    cssmin: {
      build: {
        files: {
          'dist/css/<%= pkg.name %>.min.css': [ 'src/css/*.css' ]
        }
      }
    },
    copy: {
      css: {
        cwd: 'src/css',
        src: [ '*.css' ],
        dest: 'dist/css',
        expand: true
      }
    },
    watch: {
      coffee: {
        files: ['src/js/**/*.coffee'],
        tasks: ['coffee']
      },
      scripts: {
        files: ['src/js/*.js', 'src/css/*.css'],
        tasks: ['build']
      }
    },
    coffee: {
      compile: {
        options: {
          sourceMap: false
        },
        expand: true,
        cwd: 'src/js/coffee',
        src: ['*.coffee'],
        dest: 'src/js',
        ext: '.coffee.js'
      }
    },
    clean:{
      spm : {
        src: [ '**/.gitignore','**/.npmignore']
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'src/js',
          outdir: 'doc'
        }
      }
    }
  });
  //'coffee', are not registered by default.
  grunt.registerTask('build', ['test','uglify','concat','cssmin','copy','yuidoc']);

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['build', 'watch']);


};