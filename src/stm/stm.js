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
        .config(['$provide', '$sceProvider',function($provide, $sceProvider){
            $sceProvider.enabled(false);
        }]);
