/**
 * @requires jquery/jquery.js
 * @requires angular/angular.js
 * @requires angular/angular-animate.js
 *
 * @requires stm:bootstrap.css
 *
 * @ngdoc overview
 * @name stm
 * @description
 *
 * Базовый модуль приложения
 */

angular.module('stm',['ngAnimate'])
        .config(['$sceProvider', '$provide', '$locationProvider', function($sceProvider, $provide, $locationProvider){
            $sceProvider.enabled(false);
            $locationProvider.html5Mode(true);
        }])
        .run(['$location', '$rootScope', function($location, $rootScope){
            var baseUrl = $location.absUrl();
            $rootScope.$on('$locationChangeStart', function(e, newUrl){  
                if(newUrl.indexOf(baseUrl) < 0) window.location.href = newUrl;
            });
        }]);
