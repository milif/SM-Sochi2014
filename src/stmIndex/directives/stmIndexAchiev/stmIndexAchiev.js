"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexAchiev
 * @function
 *
 * @requires stmIndex.directive:stmIndexAchiev:b-achiev.css
 * @requires stmIndex.directive:stmIndexAchiev:template.html
 *
 * @description
 * 
 * Achiev
 *
 * @param {String} stmIndexAchiev Тип
 * @param {String} text Название
 * @param {Boolean} active Активность
 * 
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div stm-index-achiev="biathlon.journalist" text="Журналист" active="true"></div>
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexAchiev', function(){
    return {
        scope: true,
        replace: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexAchiev:template.html',
        controller: ['$scope', '$attrs', function($scope, $attrs){
            $attrs.$observe('stmIndexAchiev', function(type){
                $scope.mod = type.replace('.','_');
                $scope.isQuiz = /^(map\.|other\.)/.test(type);
                if($scope.isQuiz) $scope.mod = type.split('.')[1];
            });
            $attrs.$observe('text', function(text){
                $scope.text = text;
            });
            $attrs.$observe('active', function(active){
                $scope.active = $scope.$eval(active);
            });
        }]
    }
});
