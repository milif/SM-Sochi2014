"use strict";
/**
 * @requires jquery/jquery.js
 * @requires angular/angular.js
 * @requires angular/angular-animate.js
 * @requires angular/angular-resource.js
 *
 * @requires stm:bootstrap.css
 *
 * @ngdoc overview
 * @name stm
 * @description
 *
 * Базовый модуль приложения
 */

angular.module('stm',['ngAnimate','ngResource'])
        .config(['$sceProvider', '$provide', '$locationProvider', '$httpProvider', function($sceProvider, $provide, $locationProvider, $httpProvider){
            $sceProvider.enabled(false);
            $locationProvider.html5Mode(true);
        }])
        .run(['$location', '$rootScope', '$cacheFactory', '$http', '$stmEnv','$stmGtm', function($location, $rootScope, $cacheFactory, $http, $stmEnv, $stmGtm){
        
            var $$ = angular;
        
            var baseUrl = $location.absUrl();
            $rootScope.$on('$locationChangeStart', function(e, newUrl){  
                if(newUrl != baseUrl && newUrl.replace(/[#\?].*?$/,'').indexOf(baseUrl.replace(/[#\?].*?$/,'')) < 0) {
                    e.preventDefault();
                    window.location.href = newUrl;
                }
            });
            $rootScope.$on('loaded', function(e){
                var hash = /\#.*?$/.exec($location.url());  
                if(hash) {
                    var anchorEl = $(hash[0]);
                    if(anchorEl.length > 0) {
                        $('html,body').scrollTop(anchorEl.offset().top - parseInt(anchorEl.css('marginTop')));
                    }
                }
            });
            
            // Cache
            var cache = $cacheFactory('stm');
            $http.defaults.cache = cache;
            
            if($stmEnv.api){
                var api = $stmEnv.api;
                for(var key in api){
                    cache.put(key, api[key]);
                }
            }
                        
            // GTM
            var gtmCfg =  $stmEnv.gtm;
            if(gtmCfg) $stmGtm.init(gtmCfg.id, gtmCfg.data);
        }])
        /**
         * @ngdoc service
         * @name stm.$stmGtm
         * @description
         *
         * Google tag manager
         *
         */        
        .factory('$stmGtm', ['$window', function($window){
            var $stmGtm = {
                init: init
            };
            
            var l = '_GTMdataLayer';
            var $ = angular.element;
            function init(id, data){
                var layer = $window[l] = data || [];
                layer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                var f = document.getElementsByTagName('script')[0],j=document.createElement('script');
                j.async=true;
                j.src='//www.googletagmanager.com/gtm.js?id='+id+'&l='+l;
                f.parentNode.insertBefore(j,f);
            }
            return $stmGtm;
        }])
        /**
         * @ngdoc service
         * @name stm.$stmEnv
         * @description
         *
         * Начальные данные приложения
         *
         */
         /**
           * @ngdoc property
           * @name stm.$stmEnv#auth
           * @propertyOf stm.$stmEnv
           * @returns {Object} Начальные данные авторизации. Если пользователь не авторизован, то `null`
           */ 
         /**
           * @ngdoc property
           * @name stm.$stmEnv#gtm
           * @propertyOf stm.$stmEnv
           * @returns {Object} Данные Google tag manager.
           *       { 
           *         'id': {String},
           *         'data': {Object}
           *       }            
           */            
         /**
           * @ngdoc property
           * @name stm.$stmEnv#api
           * @propertyOf stm.$stmEnv
           * @returns {Object} Кэш запросов
           * @description
           * Предзагрузка кэша, который используется службой `$http`
           *
           *       { 
           *         'url/for/something': {*} 
           *       }  
           */                           
        .value('$stmEnv',{});
