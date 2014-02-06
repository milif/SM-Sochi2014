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

angular.module('appExample', [
        'stm', 'stmIndex', 'stmGameClimber', 'stmGameEti', 'stmGameBiathlon', 'stmIndexPage', 'stmCabinet' // API modules
    ])
    .config(['$sceProvider', '$locationProvider', function($sceProvider, $locationProvider){
        $sceProvider.enabled(false);
        $locationProvider.html5Mode(false);
    }])
    .value('$stmEnv', { auth: {}});
