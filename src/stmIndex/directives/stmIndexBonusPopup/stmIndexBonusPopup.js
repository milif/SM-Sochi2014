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
 * @param {Integer} bonus Кол-во бонусов
 * @param {String} type Тип попапа (sber|mnogo|pickpoint)
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
          <div stm-index-bonus-popup bonus="500" type="pickpoint"></div>
          <br>
          <div stm-index-bonus-popup bonus="1500" type="mnogo"></div>
          <br>
          <div stm-index-bonus-popup bonus="500" type="sber"></div>
        <div>
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexBonusPopup', function(){
    var TEXT = {
        'pickpoint': 'Спасибо за упорство от Пикпоинта!',
        'mnogo': 'от Много.ру!',
        'sber': 'Спасибо за упорство от Сбербанка!'
    }
    return {
        scope: true,
        replace: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonusPopup:template.html',
        controller: ['$scope', '$element', '$animate', '$timeout', '$attrs', function($scope, $element, $animate, $timeout, $attrs){
            $attrs.$observe('type', function(type){
                $scope.type = $scope.$eval(type) || type;
                $scope.text = TEXT[type];
            });
            $attrs.$observe('bonus', function(bonus){
                $scope.bonus = $scope.$eval(bonus);
            });
        }]
    };
});
