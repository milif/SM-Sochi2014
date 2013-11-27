var q = require('q');
var qfs = require('q-fs');
var utils = require('../utils.js');

module.exports = function(grunt) {  
  grunt.registerTask('buildapp', 'create app', function(){
       
    var config = grunt.config(this.name);
    var done = this.async();
    var promises = [];
    
    var partialsDir = config.buildDir + '/' + config.partialsDir;
    
    if(grunt.file.exists(config.buildDir)) {
        grunt.file.delete(config.buildDir, {force: true});
    }
    
    grunt.file.mkdir(config.buildDir);
    
    var includeRegex = /<\!--\s*@include\s*(.*?)\s*-->/g;
    
    
    promises.push(qfs.copyTree('app', config.buildDir + '/prod'));
    promises.push(qfs.copyTree('app', config.buildDir + '/dev'));
    
    q.all(promises).done(function(){
    
        var modulesDir = config.buildDir + '/prod/modules';
        
        qfs.symbolicLink(config.buildDir + '/prod/' + config.partialsDir, '../' + config.partialsDir, 'dir');

        utils.buildModules({
            main: config.modules,
            lib: config.lib,
            components: config.components,
            buildDir: modulesDir,
            partialsDir: partialsDir      
        }, function(){
            var contentProd = '';
            var contentDev = '';
            grunt.file.expand(config.buildDir + '/prod/*.{html,php}').forEach(function(file){
                var content = grunt.file.read(file);
                var includes = content.match(includeRegex);
                grunt.util._.forEach(includes, function(include){
                    includeRegex.lastIndex = 0;
                    var moduleDir = modulesDir + '/' + includeRegex.exec(include)[1];
                    var includeScripts = '';
                    grunt.file.expand(moduleDir + '/components.*.js').forEach(function(file){
                        includeScripts += '<script type="text/javascript" src="'+ file.replace(config.buildDir + '/prod/','') +'"></script>\n';
                    });
                    grunt.file.expand(moduleDir + '/*.min.js').forEach(function(file){
                        includeScripts += '<script type="text/javascript" src="'+ file.replace(config.buildDir + '/prod/','') +'"></script>\n';
                    });
                    contentProd = content.replace(include, includeScripts);
                    
                    // ***
                    
                    qfs.symbolicLink(config.buildDir + '/dev/src', qfs.absolute('src'), 'dir');
                    qfs.symbolicLink(config.buildDir + '/dev/asset', qfs.absolute('asset'), 'dir');
                    qfs.symbolicLink(config.buildDir + '/dev/lib', qfs.absolute('build/components'), 'dir');
                    qfs.symbolicLink(config.buildDir + '/dev/' + config.partialsDir, '../' + config.partialsDir, 'dir');
                    
                    var componentJS = '';
                    var componentCSS = '';
                    grunt.file.expand(moduleDir + '/*.map','!'+moduleDir + '/*.js.map').forEach(function(file){
                      var map = JSON.parse(grunt.file.read(file));
                      grunt.util._.forEach(map.js, function(files){
                        grunt.util._.forEach(files.files, function(file){
                            file = file
                                .replace(/build\/components/g, 'lib');
                            if(file.indexOf('.js') > 0){
                                componentJS += '<script type="text/javascript" src="'+ file +'"></script>\n';
                            } else {
                                componentCSS += '<link rel="stylesheet" href="'+ file +'" type="text/css">\n';
                            }
                            
                        });            
                      });                     
                      contentDev = content.replace(include, componentCSS + componentJS);
                    });
                });
                
                grunt.file.write(file, contentProd);
                grunt.file.write(file.replace('/prod/','/dev/'), contentDev);
                
                grunt.log.ok('app created.\n\nПриложение доступно из папки ' + qfs.absolute(config.buildDir));
                
                done();
            });
                      
        });
        
    });
  
    
  });
}
