/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexBonus
 * @function
 *
 * @requires stmIndex.directive:stmIndexBonus:b-bonus.css
 * @requires stmIndex.directive:stmIndexBonus:template.html
 *
 * @description
 * Bonus
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
          <div stm-index-bonus="bonusId1" type="pickpoint" position="[0,0]"></div>
          <div stm-index-bonus="bonusId2" type="mnogo" position="[100,0]"></div>
          <div stm-index-bonus="bonusId3" type="sber" position="[200,0]"></div>
        <div>
      </file>
      <file name="style.css">
      .b-sample {
          position:relative;
          z-index:1;
          height: 200px;
          width: 200px;
      }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexBonus', function(){
    return {
        scope: {
            'stm-index-bonus': '@',
            type: '@',
            position: '='
        },
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonus:template.html',
        controller: ['$scope', '$element', '$attrs', '$animate', function($scope, $element, $attrs, $animate){
            $element.find('>div').css({
                left: $scope.position[0] + 'px',
                top: $scope.position[1] + 'px'
            });
            $scope.$on('removeBonus-'+$scope['stm-index-bonus'], function(event, e){
                $animate.leave($element);
            });
        }]
    };
});
