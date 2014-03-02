"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexBonusInfo
 * @function
 *
 * @requires stmIndex.directive:stmIndexBonusInfo:b-bonusInfo.css
 * @requires stmIndex.directive:stmIndexBonusInfo:template.html
 * @requires stmIndex.directive:stmIndexTabs
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="example-info">
            <div stm-index-bonus-info></div>
        </div>
      </file>
      <file name="style.css">
         .example-info {
            background: white;
            padding: 20px;
            text-align: center;
            }
      </file>      
    </example>
 * 
 */
angular.module('stmIndex').directive('stmIndexBonusInfo', [function(){
    return {
        replace: true,
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonusInfo:template.html'
    };
}]);
