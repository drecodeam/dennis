---
title: Introduction to dennis
writings: blog
layout : article.hbs
showNav: true
---

### INTRODUCTION
Dennis is still in very alpha stage and is being actively developed right now.

### GETTING STARTED
Dennis is based on Assemble Grunt plugin, so basically all the magic happens in the grunt file.
Like all Grunt projects, all you have to do to start working on is run npm install.

```
npm install
```

**Understanding the Grunt structure**

```js
module.exports = function (grunt) {
  'use strict';

  var paths = {
    sourceBase   : 'src',
    buildBase    : 'dist/',
    sourceAssets : 'src/bonnet',
    buildAssets  : 'dist/assets',
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
          helpers   : '<%= paths.sourceAssets %>/helpers/**/*.js',
          partials  : '<%= paths.sourceAssets %>/partials/**/*',
          layoutdir : '<%= paths.sourceAssets %>/layouts',
          data      : '<%= paths.sourceAssets %>/data/*.json',
          expand    : true,
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
        sourceMap: 'inline',
        style: 'compressed'
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
        minify: false,
        info: true,
        rejected: true
      },
      target: {
        src: ['<%= paths.buildBase %>/**/*.html', '<%= paths.buildAssets %>/**/*.js'],
        css: ['<%= paths.buildAssets %>/css/**/main.css'],
        dest: '<%= paths.buildAssets %>/css/trimmed.css'
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
        src: '<%= paths.buildAssets %>/css/trimmed.css'
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
    responsive_images_converter: {
      blog: {
        options : {
          queries: [{
            name: 'phone',
            media: '(max-width:500px)',
            //device pixel ratio( 1 is default )
            dprs: [ 1 ],
            suffix: '@'
          },{
            name: 'tablet',
            media: '(max-width:800px)',
            //device pixel ratio( 1 is default )
            dprs: [ 1 ],
            suffix: '@'
          },{
            name: 'desktop',
            media: '(min-width:800px)',
            //device pixel ratio( 1 is default )
            dprs: [ 1 ],
            suffix: '@'
          },
          {
            name: 'phone',
            media: '(max-width:500px)',
            //device pixel ratio( 1 is default )
            dprs: [ 2 ],
            suffix: '@'
          },{
            name: 'tablet',
            media: '(max-width:800px)',
            //device pixel ratio( 1 is default )
            dprs: [ 2 ],
            suffix: '@'
          },{
            name: 'desktop',
            media: '(min-width:800px)',
            //device pixel ratio( 1 is default )
            dprs: [ 2 ],
            suffix: '@'
          }]
        },
        src: [ '<%= paths.postsSource %>/**/*.md' ],
      }
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
  grunt.registerTask('default', ['assemble', 'sass', 'connect' ]);

  // Build task
  grunt.registerTask('build', ['assemble', 'sass', 'purifycss', 'postcss', 'gh-pages' ]);

};
```
