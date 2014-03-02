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
    
    init: {
        bower: {
            'angular': 'angularjs/build',
            'jquery': 'jquery',
            'angularui': 'angular-ui-utils'
        }
    },    
    buildapp: {
        modules: [
            {  
                name: 'stmIndexPage', // Module and package name 
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
                name: 'stmIndexAbout', //  Package name
                module: 'stmIndex', // Module name
                include: [        // Include module components:
                    'directive:stmIndexAbout',
                    'stm.directive:stmPreload'
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]
            }, 
            {  
                name: 'stmIndexConfirmation', //  Package name
                module: 'stmIndex', // Module name
                include: [        // Include module components:
                    'directive:stmIndexConfirmation',
                    'stm.directive:stmPreload'
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]
            },                
            {  
                name: 'stmIndexSale', //  Package name
                module: 'stmIndex', // Module name
                include: [        // Include module components:
                    'directive:stmIndexSale',
                    'stm.directive:stmPreload'
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]
            }, 
            {  
                name: 'stmCabinet', //  Module and package name 
                include: [        // Include module components:
                    'directive:stmCabinetScreen',
                    'stm.directive:stmPreload'
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]
            },                                       
            {  
                name: 'stmIndex', 
                include: [        // Include module components:
                    'directive:stmIndexMap',
                    'directive:stmIndexToolbar',
                    'stm.directive:stmPreload'
                    // 'directive:stmIndexHellowWorld',
                    // 'directive:*',
                    //'*'                                                 
                ],
                includeAsset: true ,
                includeTemplates: [
                    '*'
                ] 
            },
            {  
                name: 'stmGameEti', 
                include: [        // Include module components:
                    'directive:stmGameEtiScreen',
                    'stm.directive:stmPreload'                                            
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ] 
            },
            {  
                name: 'stmGameClimber', 
                include: [        // Include module components:
                    'directive:stmGameClimberScreen',
                    'stm.directive:stmPreload'
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]
            },
            {  
                name: 'stmGameBiathlon', 
                include: [        // Include module components:
                    'directive:stmGameBiathlonScreen',
                    'stm.directive:stmPreload'                                              
                ],
                includeAsset: true,
                includeTemplates: [
                    '*'
                ]   
            }
            
        ],
        lib: ['src/**/*.+(js|html)'],
        components: ['build/components'],
        buildDir: 'build/app',
        modulesDir: 'www/modules',
        partialsDir: 'partials'
    },
    
    builddocs:{
        main: ['appExample'],
        lib: ['docs/appExample/**/*.+(js|html)', 'src/**/*.+(js|html)'],
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
