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
        'stm', 'stmIndex', 'stmGameClimber', 'stmGameEti', 'stmGameBiathlon', 'stmIndexPage', 'stmIndexToolbar' // API modules
    ])
    .config(['$sceProvider', function($sceProvider){
        $sceProvider.enabled(false);
    }]);
