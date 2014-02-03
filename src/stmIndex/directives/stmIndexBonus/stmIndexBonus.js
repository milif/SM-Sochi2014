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
 * @param {String} stmIndexBonus component id 
 * @param {Array} position set bonus position [x, y]
 * @param {String} type bonus type (sber|mnogo|pickpoint)
 * @param {Boolean} hide hide component
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="bonusesCtrl">
            <div class="btn" ng-click="show()">Show</div>
            <div class="b-sample" >
              <div ng-repeat="bonus in bonuses" stm-index-bonus="bonusId{{$index}}" type="{{bonus.type}}" position="{{bonus.pos}}"></div>
              <div stm-index-bonus="bonusId3" type="sber" position="[350, 50]"></div>
              
            <div>
        </div>
        
      </file>
      <file name="style.css">
      .b-sample {
          position:relative;
          z-index:1;
          height: 200px;
          width: 400px;
      }
      </file>
      <file name="controller.js">
        function bonusesCtrl($scope, $timeout){
            $scope.show = function(){
                $scope.bonuses = [
                    {pos: [50, 50], type: "mnogo" }, 
                    {pos: [150, 50], type: "sber"}, 
                    {pos: [250, 50], type: "pickpoint"}
                ];
                for(var i=0;i<$scope.bonuses.length;i++){
                    $timeout(function(){
                        i--
                        $scope.$broadcast('removeBonus-bonusId' + i);
                    }, 1000 * (i+1));
                }
            }
        }
      </file>
    </example>
    
 */
/**
   * @ngdoc event
   * @name stmIndex.directive:stmIndexBonus#removeBonus-ID
   * @eventOf stmIndex.directive:stmIndexBonus
   * @eventType local on scope
   * @description
   * Инициирует скрытие компонента 
   * 
   */
angular.module('stmIndex').directive('stmIndexBonus', function(){
    return {
        scope: {
            stmIndexBonus: '@',
            type: '@',
            position: '@',
            show: '@' 
        },
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonus:template.html',
        controller: ['$scope', '$animate', '$timeout', '$attrs', function($scope, $animate, $timeout, $attrs){
        
            var isHide = $attrs.show ? !$scope.$eval($scope.show) : false;
            
            $scope.hide = true;       
            
            $scope.$watch('position', function(){
                var position = $scope.$eval($scope.position);
                $scope.css = {
                    left: position[0],
                    top: position[1]
                }
            });
            $scope.$watch('show', function(show){
                $scope.hide = !$scope.$eval(show);
            });
            $scope.$on('removeBonus-' + $scope.stmIndexBonus, function(){
                $scope.hide = true;
            });
            $scope.$on('showBonus-' + $scope.stmIndexBonus, function(){
                $scope.hide = false;
            });
            
            if(!isHide) {
                $timeout(function(){
                    $scope.hide = false;
                }, 30);
            }
        }]
    };
});
