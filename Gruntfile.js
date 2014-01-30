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
                name: 'stmIndexPage', // Module name
                include: [        // Include module components:
                    'directive:stmIndexPageScreen',
                    'stm.directive:stmPreload'
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]    
            },           
            {  
                name: 'stmIndex', // Module name
                include: [        // Include module components:
                    'directive:stmIndexMap',
                    'directive:stmIndexToolbar',
                    'stm.directive:stmPreload'
                    // 'directive:stmIndexHellowWorld',
                    // 'directive:*',
                    //'*'                                                 
                ],
                includeAsset: true  
            },
            {  
                name: 'stmGameEti', // Module name
                include: [        // Include module components:
                    'directive:stmGameEtiScreen',
                    'stm.directive:stmPreload'                                            
                ],
                includeAsset: true  
            },
            {  
                name: 'stmGameClimber', // Module name
                include: [        // Include module components:
                    'directive:stmGameClimberScreen',
                    'stm.directive:stmPreload'                                              
                ],
                includeAsset: true
            },
            {  
                name: 'stmGameBiathlon', // Module name
                include: [        // Include module components:
                    'directive:stmGameBiathlonScreen',
                    'stm.directive:stmPreload'                                              
                ],
                includeAsset: true   
            }
            
        ],
        lib: ['src/**/*.js'],
        components: ['build/components'],
        buildDir: 'build/app',
        modulesDir: 'www/modules',
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
