/**
 * @ngdoc directive
 * @name stmGameBiathlon.directive:stmGameBiathlonWarningPopup
 * @function
 *
 * @requires stmGameBiathlon.directive:stmGameBiathlonWarningPopup:b-warning-popup.css
 * @requires stmGameBiathlon.directive:stmGameBiathlonWarningPopup:template.html
 *
 * @description
 * Warning popup
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
          <div stm-game-biathlon-warning-popup><h3>Опасность!</h3>Йети догоняет, <br>поднажми</div>
        <div>
      </file>
    </example>
    
 */

angular.module('stmGameBiathlon').directive('stmGameBiathlonWarningPopup', function(){
    return {
        scope: true,
        transclude: true,
        replace: true,
        templateUrl: 'partials/stmGameBiathlon.directive:stmGameBiathlonWarningPopup:template.html',
        controller: ['$scope', '$element', '$animate', '$timeout', '$attrs', function($scope, $element, $animate, $timeout, $attrs){
        }]
    };
});
