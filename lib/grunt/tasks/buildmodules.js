var utils = require('../utils.js');

module.exports = function(grunt) {
  grunt.registerTask('buildmodules', 'Выстраивание зависимостей и сборка', function(){
    
    var config = grunt.config(this.name + '.' + this.args[0]);
    utils.buildModule(config, this.async());
            
  });
};
