"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexAchievsInfo
 * @function
 *
 * @requires stmIndex.directive:stmIndexAchievsInfo:b-achievsInfo.css
 * @requires stmIndex.directive:stmIndexAchievsInfo:template.html
 *
 * @requires stmIndex.directive:stmIndexAchiev
 * @requires stmIndex.directive:stmIndexTabs
 *
 * @description
 * 
 * Информация об ачивах
 *
 * @param {Array} stmIndexAchievsInfo Набор ачивов
 * @param {String} type Тип ачивов
 * @param {Boolean} tabActive Активировать при переключении
 * 
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="controller">
            <div stm-index-achievs-info="achievs" tab-active="true" type="biathlon"></div>
            <div stm-index-achievs-info="achievs2" tab-active="false" type="biathlon"></div>
        </div>
      </file>
      <file name="controller.js">
        function controller($scope, $stmAchievs){
            $scope.achievs = $stmAchievs.biathlon;
            $scope.achievs2 = angular.copy($scope.achievs);
            $scope.achievs2[2].active = true;
        }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexAchievsInfo', function(){
    return {
        scope: true,
        replace: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexAchievsInfo:template.html',
        controller: ['$scope', '$attrs', function($scope, $attrs){
            var achievs;
            var activeIndex=0;
            var tabActive;
            $scope.$on('activeTab', function(e, i){
                $scope.$apply(function(){
                    achievs[i].tabActive = true;
                    achievs[activeIndex].tabActive = false;
                    if(tabActive) {
                        achievs[activeIndex].active = false;
                        achievs[i].active = true;
                    }
                    activeIndex = i;                
                });
            });
            $attrs.$observe('type', function(type){
                $scope.type = type;
            });
            $attrs.$observe('tabActive', function(active){
                tabActive = $scope.$eval(active);
            });
            $attrs.$observe('stmIndexAchievsInfo', function(data){
                achievs = $scope.achievs = $scope.$eval(data);
                achievs[activeIndex].tabActive = true;
                if(tabActive) {
                     achievs[activeIndex].active = true;
                }
            });
        }]
    }
});
