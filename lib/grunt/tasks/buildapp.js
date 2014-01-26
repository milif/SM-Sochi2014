var q = require('q');
var qfs = require('q-fs');
var path = require('path');
var utils = require('../utils.js');

module.exports = function(grunt) {  
  grunt.registerTask('buildapp', 'create app', function(){
       
    var config = grunt.config(this.name);
    var done = this.async();
    var promises = [];
    
    if(grunt.file.exists(config.buildDir)) {
        grunt.file.delete(config.buildDir, {force: true});
    }
    
    grunt.file.mkdir(config.buildDir);
    
    var includeRegex = /<\!--\s*@include\s*(.*?)\s*-->/g;
    var includeAssetRegex = /<\!--\s*@assets\s*(.*?)\s*-->/g;
    var includeTemplateRegex = /<\!--\s*@templates\s*(.*?)\s*-->/g;
    
    
    promises.push(qfs.copyTree('app', config.buildDir + '/prod'));
    promises.push(qfs.copyTree('app', config.buildDir + '/dev'));
    
    q.all(promises).done(function(){
    
        var modulesDir = config.buildDir + '/prod/modules';

        utils.buildModules({
            main: config.modules,
            lib: config.lib,
            components: config.components,
            buildDir: modulesDir,
            partialsDir: config.buildDir + '/prod/' + config.partialsDir      
        }, function(){
            grunt.file.expand([config.buildDir + '/prod/**/*.{html,php}','!**/' + config.partialsDir + '/*']).forEach(function(file){
                var content = grunt.file.read(file);
                var contentProd = content;
                var contentDev = content;
                var includes = content.match(includeRegex);
                var assets = content.match(includeAssetRegex);
                var temlates = content.match(includeTemplateRegex);
                var dirRelative;
              
                if(includes) {
                    var fileDir = path.dirname(file);
                    dirRelative = path.relative(fileDir, config.buildDir+'/prod');
                    var linkPartials = fileDir + '/' + config.partialsDir;             
                    if(dirRelative != "" && !grunt.file.exists(linkPartials)){
                        var toPartials = dirRelative + '/' + config.partialsDir;
                        qfs.symbolicLink(linkPartials, toPartials, 'dir');
                        qfs.symbolicLink(linkPartials.replace('/prod/','/dev/'), toPartials, 'dir');
                        qfs.symbolicLink(fileDir + '/asset', dirRelative + '/asset', 'dir');
                        qfs.symbolicLink(fileDir.replace('/prod/','/dev/') + '/asset', dirRelative + '/asset', 'dir');
                        
                    }
                }             
                grunt.util._.forEach(assets, function(include){
                    includeAssetRegex.lastIndex = 0;
                    var moduleName = includeAssetRegex.exec(include)[1];
                    var moduleDir = modulesDir + '/' + moduleName;
                    var mapFilePath = grunt.file.expand([moduleDir + '/*.map','!**/*.js.map'])[0];                   
                    if(!mapFilePath) return;
                    var mapFile = JSON.parse(grunt.file.read(mapFilePath));
                    var assetCnt = '<script type="text/javascript">window._assets = (window._assets || []).concat('+ JSON.stringify(mapFile.assets) +')</script>';
                    contentProd = contentProd.replace(include, assetCnt);
                    contentDev = contentDev.replace(include, assetCnt);
                });                
                
                grunt.util._.forEach(temlates, function(include){
                    includeTemplateRegex.lastIndex = 0;
                    var files = includeTemplateRegex.exec(include)[1];
                    grunt.file.expand(config.buildDir + '/prod/' + config.partialsDir + '/' + files).forEach(function(file){
                        var tplCnt = grunt.file.read(file);
                        contentProd = contentProd.replace(include, '<script type="text/ng-template" id="' + config.partialsDir + '/' +path.basename(file)+'">' + tplCnt
                            .replace(/(\n|\r\n|\r)/gm, '')
                            .replace(/ {2,}/g,' ')
                            .replace(/<!--.*?-->/g,'')
                         + '</script>');
                        contentDev = contentDev.replace(include, '<script type="text/ng-template" id="' + config.partialsDir + '/' +path.basename(file)+'">' + tplCnt + '</script>');
                    });
                    
                });
                
                grunt.util._.forEach(includes, function(include){              
                    includeRegex.lastIndex = 0;
                    var moduleDir = modulesDir + '/' + includeRegex.exec(include)[1];                   
                    var includeScripts = '';
                    var prefixFile = dirRelative != "" ? dirRelative + "/" : "";
                    grunt.file.expand(moduleDir + '/components.*.js').forEach(function(file){
                        includeScripts += '<script type="text/javascript" src="'+ prefixFile + file.replace(config.buildDir + '/prod/','') +'"></script>\n';
                    });
                    grunt.file.expand(moduleDir + '/*.min.js').forEach(function(file){
                        includeScripts += '<script type="text/javascript" src="'+ prefixFile + file.replace(config.buildDir + '/prod/','') +'"></script>\n';
                    });
                    
                    contentProd = contentProd.replace(include, includeScripts);
                    
                    // ***
                    
                    var componentJS = '';
                    var componentCSS = '';
                    grunt.file.expand(moduleDir + '/*.map','!'+moduleDir + '/*.js.map').forEach(function(file){
                      var map = JSON.parse(grunt.file.read(file));
                      grunt.util._.forEach(map.js, function(files){
                        grunt.util._.forEach(files.files, function(file){
                            file = file
                                .replace(/build\/components/g, 'lib');
                            if(dirRelative != "") file = dirRelative + '/' + file;
                            if(file.indexOf('.js') > 0){
                                componentJS += '<script type="text/javascript" src="'+ file +'"></script>\n';
                            } else {
                                componentCSS += '<link rel="stylesheet" href="'+ file +'" type="text/css">\n';
                            }
                            
                        });            
                      });                     
                      contentDev = contentDev.replace(include, componentCSS + componentJS);
                    });                   
                });
                
                grunt.file.write(file, contentProd);
                grunt.file.write(file.replace('/prod/','/dev/'), contentDev);
                
            });
            
            qfs.symbolicLink(config.buildDir + '/dev/favicon.ico', '../prod/favicon.ico', 'dir');
            qfs.symbolicLink(config.buildDir + '/dev/src', qfs.absolute('src'), 'dir');
            qfs.symbolicLink(config.buildDir + '/dev/asset', '../prod/asset', 'dir');
            qfs.symbolicLink(config.buildDir + '/dev/lib', qfs.absolute('build/components'), 'dir');
            qfs.symbolicLink(config.buildDir + '/dev/' + config.partialsDir, '../prod/' + config.partialsDir, 'dir');            
            
            qfs.symbolicLink(config.buildDir + '/prod/favicon.ico', qfs.absolute('favicon.ico'), 'file');
            qfs.symbolicLink(config.buildDir + '/docs', '../docs', 'dir');      
            
            qfs.copyTree('asset', config.buildDir + '/prod/asset').done(function(){
                grunt.log.ok('app created.\n\nПриложение доступно из папки ' + qfs.absolute(config.buildDir));
                done();
            });

        });
        
    });
  
    
  });
}
