/**
 * 
 * @requires *
 * @requires appExample:appExample.css
 *
 * @ngdoc overview
 * @name appExample
 * @description
 *
 * Модуль примеров
 */

angular.module('appExample', ['stm'])
    .config(['$sceProvider', function($sceProvider){
        $sceProvider.enabled(false);
    }]);
