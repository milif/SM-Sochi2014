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
        .run(['$location', '$rootScope', '$cacheFactory', '$http', '$stmEnv', function($location, $rootScope, $cacheFactory, $http, $stmEnv){
            var baseUrl = $location.absUrl();
            $rootScope.$on('$locationChangeStart', function(e, newUrl){  
                if(newUrl.indexOf(baseUrl) < 0) window.location.href = newUrl;
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
           * @name stm.$stmEnv#clientId
           * @propertyOf stm.$stmEnv
           * @returns {String} Идентификатор пользователя
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
