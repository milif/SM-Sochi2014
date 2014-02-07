var q = require('q');
var qfs = require('q-fs');
var path = require('path');
var shell = require('shelljs');
var utils = require('../utils.js');

module.exports = function(grunt) {  
  grunt.registerTask('buildapp', 'create app', function(){
       
    var config = grunt.config(this.name);
    var done = this.async();
    var promises = [];
    var cmd;
    var version = utils.getVersion();
    
    if(grunt.file.exists(config.buildDir)) {
        grunt.file.delete(config.buildDir, {force: true});
    }
    
    grunt.file.mkdir(config.buildDir);
    
    var includeRegex = /<\!--\s*@include\s*(.*?)\s*-->/g;
    var baseRegex = /<\s*base\s*href\s*=\s*['"]{0,1}(.+)['"]{0,1}.*?>/;      
    
    cmd = '(cd \'' + qfs.absolute('.') + '\';cp -R app ' + config.buildDir + '/prod;cp -R app ' + config.buildDir + '/dev;)';
    shell.exec(cmd, {silent: false});
    
    var correctBaseUri = "<script type='text/javascript'>(function(){var el=document.getElementsByTagName('base')[0];if(el)el.setAttribute('href', el.href);})();</script>\n";
    
    q.all(promises).done(function(){
    
        var modulesDir = config.buildDir + '/prod/' + config.modulesDir;
        var docRootDir = path.dirname(modulesDir);
        var partialsDir = docRootDir + '/' + config.partialsDir;

        utils.buildModules({
            main: config.modules,
            lib: config.lib,
            components: config.components,
            buildDir: modulesDir,
            partialsDir: partialsDir
        }, function(){
            grunt.file.expand([config.buildDir + '/prod/**/{*.html,index.php,tpl/*.php}','!**/' + config.partialsDir + '/*']).forEach(function(file){
                var content = grunt.file.read(file);
                
                //FIX: relative BASE
                var baseTag = baseRegex.exec(content);                
                if(baseTag && !/(^[\/]|\/\/)/.test(baseTag[1])){
                    content = content.replace(baseTag[0], '<script text="text/javascript">(function(){var a=document.createElement("a");a.setAttribute("href",".");window.__href=a.href;})()</script>' + baseTag[0] + '<script text="text/javascript">(function(){var el=document.getElementsByTagName("base")[0];if(el){var h=el.getAttribute("href");var u=__href + el.getAttribute("href"),a=document.createElement("a");a.setAttribute("href",u);el.setAttribute("href",a.href);}})()</script>');
                }
                
                var contentProd = content;
                var contentDev = content;
                var includes = content.match(includeRegex);
                var dirRelative;
              
                if(includes) {
                    var fileDir = path.dirname(file);
                    var linkPartials = fileDir + '/' + config.partialsDir;    
                }                             
                
                grunt.util._.forEach(includes, function(include){              
                    includeRegex.lastIndex = 0;
                    var moduleDir = modulesDir + '/' + includeRegex.exec(include)[1];                   
                    var includeScripts = '';
                    var prefixFile = '';
                    grunt.file.expand(moduleDir + '/components.*.js').forEach(function(file){
                        includeScripts += '<script type="text/javascript" src="'+ prefixFile + file.replace(docRootDir + '/', '') +'"></script>';
                    });
                    grunt.file.expand(moduleDir + '/*.min.js').forEach(function(file){
                        includeScripts += '<script type="text/javascript" src="'+ prefixFile + file.replace(docRootDir + '/', '') +'"></script>';
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
                            if(file.indexOf('.js') > 0){
                                componentJS += '<script type="text/javascript" src="'+ file +'"></script>';
                            } else {
                                componentCSS += '<link rel="stylesheet" href="'+ file +'" type="text/css">';
                            }
                            
                        });            
                      });                     
                      
                      var assets = '';
                      if(map.assets){
                         assets = '<script type="text/javascript">window._assets = (window._assets || []).concat('+ JSON.stringify(map.assets) +')</script>';
                      }                 
                      
                      contentDev = contentDev.replace(include, componentCSS + componentJS + assets);
                    });                   
                });
                
                
                grunt.file.write(file, utils.minHTML(contentProd));
                grunt.file.write(file.replace('/prod/','/dev/'), contentDev);
                
            });
            
            var docRootDevDir = docRootDir.replace('/prod/','/dev/');

            qfs.symbolicLink(docRootDevDir + '/favicon.ico', qfs.absolute(docRootDir + '/favicon.ico'), 'dir');
            qfs.symbolicLink(docRootDevDir + '/src', qfs.absolute('src'), 'dir');
            qfs.symbolicLink(docRootDevDir + '/asset', qfs.absolute('asset'), 'dir');
            qfs.symbolicLink(docRootDevDir + '/lib', qfs.absolute('build/components'), 'dir');
            qfs.symbolicLink(docRootDevDir + '/' + config.partialsDir, qfs.absolute(partialsDir), 'dir');            
            
            qfs.symbolicLink(docRootDir + '/favicon.ico', qfs.absolute('favicon.ico'), 'file');
            qfs.symbolicLink(config.buildDir + '/docs', '../docs', 'dir'); 
            
            grunt.file.write(config.buildDir + '/prod/_rev', version.hash);
            
            cmd = '(cd \'' + qfs.absolute('.') + '\'; cp -R asset ' + docRootDir + '/asset;)';
            shell.exec(cmd, {silent: false});
            grunt.log.ok('app created.\n\nПриложение доступно из папки ' + qfs.absolute(config.buildDir));
            done();

        });
        
    });
  
    
  });
}
