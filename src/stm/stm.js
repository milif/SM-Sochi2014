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
            $httpProvider.defaults.cache = true;
        }])
        .run(['$location', '$rootScope', function($location, $rootScope){
            var baseUrl = $location.absUrl();
            $rootScope.$on('$locationChangeStart', function(e, newUrl){  
                if(newUrl.indexOf(baseUrl) < 0) window.location.href = newUrl;
            });
        }]);
