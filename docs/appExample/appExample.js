/**
 * 
 * @requires *
 * @requires appExample:all.css
 *
 * @ngdoc overview
 * @name appExample
 * @description
 *
 * Модуль примеров
 */

angular.module('appExample', ['stm', 'stmIndex', 'stmGameClimber'])
    .config(['$sceProvider', function($sceProvider){
        $sceProvider.enabled(false);
    }]);
