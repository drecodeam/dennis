module.exports = function (grunt) {
  'use strict';

  var paths = {
    sourceBase   : 'src',
    buildBase    : 'dist/',
    sourceAssets : 'src/bonnet',
    buildAssets  : 'dist/hood',
    postsSource  : 'src/content'
  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON( './package.json' ),
    paths : paths,

    // Start a local server
    connect: {
      dev: {
        options: {
          port: 8000,
          base: paths.buildBase,
          keepalive: true
        }
      }
    },
    // Lint JS files for coventions
    jscs: {
      src : '<%= paths.sourceAssets %>/js/source/*.js',
      options : {
        config : '.jscsrc',
        fix    : true
      }
    },
    // Lint JS files
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc : true,
      },
      src : ['<%= paths.sourceAssets %>/js/source/*.js']
    },
    // Compiling javascript
    uglify: {
      options: {
        mangle: false,
        sourceMapIncludeSources : true,
        compress : {
          dead_code : true,
          drop_debugger : true,
          unused : true,
          join_vars : true,
          warnings : true,
          drop_console: true
        }
      },
      my_target: {
        files: {
          '<%= paths.buildAssets %>/js/vendor.min.js': ['<%= paths.sourceAssets %>/js/vendor/jquery.js', '<%= paths.sourceAssets %>/js/vendor/*.js'],
          '<%= paths.buildAssets %>/js/source.min.js': ['<%= paths.sourceAssets %>/js/source/*.js']
        }
      }
    },
    /* assemble templating */
    assemble: {
      main : {
        options: {
          helpers   : ['handlebars-helper-moment', '<%= paths.sourceAssets %>/helpers/**/*.js' ],
          partials  : '<%= paths.sourceAssets %>/partials/**/*',
          layoutdir : '<%= paths.sourceAssets %>/layouts',
          data      : '<%= paths.sourceAssets %>/data/*.json',
          plugins: ['assemble-contrib-permalinks'],
          permalinks: {
            preset: 'pretty'
          },
          collections : [{
            name : 'writings',
            inflection : 'writing'
          }]
        },
        files: [{
          cwd     : paths.postsSource,
          dest    : paths.buildBase,
          expand  : true,
          src     : ['**/*.{md,hbs}']
        }]
      }
    },
    // Lint SCSS files
    scsslint: {
      allFiles: ['<%= paths.sourceAssets %>/sass/**/*.scss', '!<%= paths.sourceAssets %>/sass/vendor/**/*.scss'],
      options: {
        config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      },
    },
    // SASS compiling
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '<%= paths.buildAssets %>/css/main.css': '<%= paths.sourceAssets %>/sass/main.scss'
        }
      }
    },
    // Purify CSS
    purifycss: {
      options: {
        minify: true,
        info: true,
        rejected: true
      },
      target: {
        src: ['<%= paths.buildBase %>/**/*.html', '<%= paths.buildAssets %>/**/*.js'],
        css: ['<%= paths.buildAssets %>/css/**/main.css'],
        dest: '<%= paths.buildAssets %>/css/dennis.css'
      },
    },
    // CSS minification
    postcss: {
      options: {
        map: 'inline', // inline sourcemaps
        processors: [
          require('cssnano')({
            autoprefixer : {
            }
          })
        ]
      },
      dist: {
        src: '<%= paths.buildAssets %>/css/main.css'
      }
    },
    // The ever epic watch statement
    watch: {
      options: {
        livereload: true,
      },
      js: {
        files: '<%= paths.sourceAssets %>/js/**/*.js',
        tasks: ['uglify'],
      },
      css: {
        files: '<%= paths.sourceAssets %>/sass/**/*.scss',
        tasks: ['sass', 'postcss'],
      },
      posts : {
        files : '<%= paths.postsSource %>/**/*.{md,hbs}',
        tasks : ['assemble']
      },
      layout : {
        files : '<%= paths.sourceAssets %>/**/*.hbs',
        tasks : ['assemble']
      },
      images : {
        files : '<%= paths.sourceAssets %>/images/**/*',
        tasks : ['copy:images']
      },
      fonts : {
        files : '<%= paths.sourceAssets %>/fonts/**/*',
        tasks : ['copy:fonts']
      },
      grunt: {
          files: ['Gruntfile.js']
      }
    },
    browserSync: {
        dev: {
            bsFiles: {
                src : [
                    '<%= paths.buildAssets %>/css/*.css',
                    '<%= paths.buildBase %>/*.html'
                ]
            },
            options: {
                watchTask: true,
                server: paths.buildBase
            }
        }
    },
    responsive_images_extender: {
      target: {
        options: {},
        files: [{
          expand: true,
          src: ['**/*.{html,htm,php}'],
          cwd: paths.buildBase,
          dest: paths.buildBase
        }]
      }
    },
    responsive_images: {
      options: {
        engine : 'gm',
        newFilesOnly : true,
      },
      your_target: {
        expand: true,
        src: ['images/**.{jpg,gif,png}'],
        cwd: '<%= paths.sourceAssets %>/',
        dest: '<%= paths.buildAssets %>'
      },
    },
    copy: {
      images: {
        files: [{
            expand: true,
            flatten: true,
            src: ['<%= paths.sourceAssets %>/images/**/*.{jpeg,jpg,png,gif}'],
            dest: '<%= paths.buildAssets %>/images',
            filter: 'isFile'
          },
        ]
      },
      fonts: {
        files: [{
            expand: true,
            flatten: true,
            src: ['<%= paths.sourceAssets %>/fonts/**/*'],
            dest: '<%= paths.buildAssets %>/fonts',
            filter: 'isFile'
          },
        ]
      }
    },
    // PAGE SPEED INSIGHTS
    pagespeed: {
      options: {
        nokey: true,
        url: "http://localhost:3000",
      },
      prod: {
        options: {
          url: "https://developers.google.com/speed/docs/insights/v1/getting_started",
          locale: "en_GB",
          strategy: "desktop",
          threshold: 80
        }
      },
      paths: {
        options: {
          paths: ["/writing", "/examples", "/blog/monty-python/"],
          locale: "en_GB",
          strategy: "desktop",
          threshold: 80
        }
      }
    },
    // Push the built files to the gh-pages branch
    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'gh-pages'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('assemble');

  /* grunt tasks */
  grunt.registerTask( 'dev', ['assemble', 'sass', 'postcss', 'copy', 'uglify','browserSync','watch' ] );

  // Build task
  grunt.registerTask( 'build', ['assemble', 'sass', 'postcss', 'purifycss', 'gh-pages' ] );

};
