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

    buildmodules: {
        docs: {
            main: ['appExample'],
            lib: ['docs/appExample/**/*.js', 'src/**/*.js'],
            components: ['build/components'],
            buildDir: 'build/docs/modules',
            partialsDir: 'build/docs/partials'
        }
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

  grunt.registerTask('collect-errors', 'Combine stripped error files', function () {
    util.collectErrors();
  }); 

  //alias tasks
  grunt.registerTask('package', ['shell', 'init', 'docs'/*, 'crontasks'*/]);
  grunt.registerTask('app', ['buildmodules:app']);
  grunt.registerTask('docs', ['builddocs']);
  grunt.registerTask('default', ['package']);
};
