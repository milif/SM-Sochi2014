/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSocialLike
 * @function
 *
 * @requires stmIndex.$stmSocial
 * 
 * @description
 * Панель like-кнопок
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-social-like ></div>
      </file>
    </example>
    
 */

angular.module('stmIndex')
.directive('stmIndexSocialLike', ['$stmSocial', function($stmSocial){
    
    var $ = angular.element;
    
    var share = $stmSocial.share;
    
    var counter = 0;
    
    function get(url, clbFn){
        if(get[url]){
            clbFn();
            return;
        }
        get.queue[url] = get.queue[url] || [];
        get.queue[url].push(clbFn);
        
        if(url in get) return;
        
        get[url] = false;
        
        $.getScript(url, function(){
            get.loaded[url] = true;
            for(var i=0;i<get.queue[url].length;i++){
                get.queue[url][i]();
            }
            delete get.queue[url];
        });
    } 
    get.loaded = {};
    get.queue = {};    
    
    return function(scope, el, attrs){
        likeVK(el);
        likeFB(el);
        likeTW(el);
        likeGP(el);
    };
    
    function vkApi(clbFn){
        var apiUrl = 'http://userapi.com/js/api/openapi.js';
        if(!vkApi.loaded) {
            vkApi.loaded = true;
            get(apiUrl, function(){
                VK.init({
                    apiId: 3002599, 
                    onlyWidgets: true
                });
            });            
        }
        get(apiUrl, function(){       
            clbFn.call(VK);
        });
    }     
    function likeVK(el){
        var id = 'vklike' + counter++;
        var vkEl = $('<div id="'+id+'"></div>');
        var params = {
            type: 'mini',
            height: 20,
            width: 100,
            pageUrl: share.url
        };
   
        el.append(vkEl);
        
        vkApi(function(){
            this.Widgets.Like(id, params);
        });
    }
    function fbApi(clbFn){
        var apiUrl = "http://connect.facebook.net/ru_RU/all.js";
        if(!fbApi.loaded) {
            fbApi.loaded = true;
            get(apiUrl, function(){
                FB.init({
                  appId      : '327876194000027', // App ID from the App Dashboard
                  status     : true, // check the login status upon init?
                  cookie     : true, // set sessions cookies to allow your server to access the session?
                  xfbml      : true  // parse XFBML tags on this page?
                });
            });            
        }
        get(apiUrl, function(){       
            clbFn.call(FB);
        });
    }      
    function likeFB(el){
        var fbEl = $('<span style="display: inline-block;overflow: hidden;padding-top: 2px;height: 20px;"><fb:like href="'+share.url+'" send="false" layout="button_count" width="90" show_faces="false"></fb:like></span>');
        el.append(fbEl);
        fbApi(function(){
            this.XFBML.parse(fbEl.get(0));
        });
    }
    function gpApi(clbFn){
        var apiUrl = "https://apis.google.com/js/plusone.js";
        if(!gpApi.loaded) {
            gpApi.loaded = true;
            window.___gcfg = {
                lang: 'ru',
                parsetags: 'explicit'
            };             
        }       
        get(apiUrl, function(){       
            clbFn.call(gapi.plusone);
        });
    }    
    function likeGP(el){
        var gpEl = $('<span></span>');
        el.append(gpEl);
        gpApi(function(){
            this.render(gpEl.get(0), {
                href: share.url,
                size: 'medium',
                width: 70,
            });
        });
    }
    function likeTW(el){
        var twEl = $('<a href="https://twitter.com/share" class="twitter-share-button" data-url="'+share.url+'" data-text="'+share.description+' '+share.url+'" data-lang="ru" style="width: 118px;">Tweet</a>');
        el.append(twEl);
        (function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}})(document,"script","twitter-wjs");        
    }
}]);
