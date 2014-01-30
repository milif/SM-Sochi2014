/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexBonusPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexBonusPopup:b-bonus-popup.css
 * @requires stmIndex.directive:stmIndexBonusPopup:template.html
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
          <div stm-index-bonus-popup="bonusPopupId1" bonus="500" text="Спасибо за упорство от Пикпоинта!" icon="pickpoint" position="[0,0]"></div>
          <div stm-index-bonus-popup="bonusPopupId2" bonus="1500" text="от Много.ру!" icon="mnogo" position="[20,200]"></div>
          <div stm-index-bonus-popup="bonusPopupId3" bonus="500" text="Спасибо за упорство от Сбербанка!" icon="sber" position="[0,400]"></div>
        <div>
      </file>
      <file name="style.css">
      .b-sample {
          position:relative;
          z-index:1;
          height: 600px;
          width: 400px;
      }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexBonusPopup', function(){
    return {
        scope: {
            'stm-index-bonus-popup': '@',
            icon: '@',
            bonus: '@',
            text: '@',
            position: '='
        },
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonusPopup:template.html',
        controller: ['$scope', '$element', '$attrs', '$animate', function($scope, $element, $attrs, $animate){
            $element.find('>div').css({
                left: $scope.position[0] + 'px',
                top: $scope.position[1] + 'px'
            });
            $scope.$on('removeBonus-'+$scope['stm-index-bonus-popup'], function(event, e){
                $animate.leave($element);
            });
        }]
    };
});
