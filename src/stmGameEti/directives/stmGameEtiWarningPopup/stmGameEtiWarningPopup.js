/**
 * @ngdoc directive
 * @name stmGameEti.directive:stmGameEtiWarningPopup
 * @function
 *
 * @requires stmGameEti.directive:stmGameEtiWarningPopup:b-warning-popup.css
 * @requires stmGameEti.directive:stmGameEtiWarningPopup:template.html
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
          <div stm-game-eti-warning-popup><h3>Опасность!</h3>Йети догоняет, <br>поднажми</div>
        <div>
      </file>
    </example>
    
 */

angular.module('stmGameEti').directive('stmGameEtiWarningPopup', function(){
    return {
        scope: true,
        transclude: true,
        replace: true,
        templateUrl: 'partials/stmGameEti.directive:stmGameEtiWarningPopup:template.html',
        controller: ['$scope', '$element', '$animate', '$timeout', '$attrs', function($scope, $element, $animate, $timeout, $attrs){
        }]
    };
});
