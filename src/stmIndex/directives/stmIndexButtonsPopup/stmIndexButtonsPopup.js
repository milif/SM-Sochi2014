/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexButtonsPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexButtonsPopup:b-buttons-popup.css
 * @requires stmIndex.directive:stmIndexButtonsPopup:template.html
 *
 * @description
 * Buttons
 *
 * @element ANY
 * @param {String} key Клавиша (mod_space|left|right|top|bottom|A-Z)
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
          <div stm-index-buttons-popup key="right">Жми стрелку <b>Вправо</b>,<br>чтобы ускорится</div>
          <div stm-index-buttons-popup key="left">Жми стрелку <b>Влево</b>,<br>чтобы ускорится</div>
          <div stm-index-buttons-popup key="top">Жми стрелку <b>Вверх</b>,<br>чтобы ускорится</div>
          <div stm-index-buttons-popup key="bottom">Жми стрелку <b>Вниз</b>,<br>чтобы ускорится</div>
          <div stm-index-buttons-popup key="mod_space">Жми <b>Пробел</b>,<br>чтобы ускорится</div>
          <div stm-index-buttons-popup key="F">Жми <b>F</b>, чтобы ...</div>
        <div>
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexButtonsPopup', function(){
    return {
        scope: true,
        transclude: true,
        replace: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexButtonsPopup:template.html',
        controller: ['$scope', '$element', '$animate', '$timeout', '$attrs', function($scope, $element, $animate, $timeout, $attrs){
            $attrs.$observe('key', function(key){
                $scope.key = $scope.$eval(key) || key;
                switch($scope.key) {
                    case 'mod_space':
                        $scope.keytext = '&nbsp;';
                        break;
                    case 'left':
                        $scope.keytext = '&#8592;';
                        break;
                    case 'right':
                        $scope.keytext = '&#8594;';
                        break;
                    case 'top':
                        $scope.keytext = '&#8593;';
                        break;
                    case 'bottom':
                        $scope.keytext = '&#8595;';
                        break;
                    default:
                        $scope.keytext = $scope.key;
                }
            });
        }]
    };
});
