var util = require('./lib/grunt/utils.js');

module.exports = function(grunt) {

  var VERSION = util.getVersion();

  //grunt plugins
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadTasks('lib/grunt/tasks');

  //config
  grunt.initConfig({
  
    VERSION: VERSION,
    
    buildapp: {
        modules: [
            {  
                name: 'stmIndex', // Module name
                include: [        // Include module components:
                    'directive:stmIndexMap'
                    // 'directive:stmIndexHellowWorld',
                    // 'directive:*',
                    //'*'                                                 
                ]    
            },
            {  
                name: 'stmGameEti', // Module name
                include: [        // Include module components:
                    'directive:stmGameEtiScreen'                                               
                ]    
            },
            {  
                name: 'stmGameClimber', // Module name
                include: [        // Include module components:
                    'directive:stmGameClimberScreen'                                               
                ]    
            }                       
        ],
        lib: ['src/**/*.js'],
        components: ['build/components'],
        buildDir: 'build/app',
        partialsDir: 'partials'
    },
    
    builddocs:{
        main: ['appExample'],
        lib: ['docs/appExample/**/*.js', 'src/**/*.js'],
        components: ['build/components'],
        buildDir: 'build/docs/modules',
        partialsDir: 'build/docs/partials'
    },
    shell: {
      init: {
        command: 'bower install',
        options: {
            stdout: true
        }        
      },
      angular: {
        command: '(cd bower_components/angularjs; npm install; grunt)',
        options: {
            stdout: true
        }        
      } 
    }    
  });

  //alias tasks
  grunt.registerTask('package', ['shell', 'init', 'docs', 'app']);
  grunt.registerTask('app', ['buildapp']);
  grunt.registerTask('docs', ['builddocs']);
  grunt.registerTask('default', ['package']);
};
