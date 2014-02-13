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
 * @param {Integer} timeout set auto-destroy timeout in seconds
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="bonusesCtrl">
            <div class="btn" ng-click="show()">Show</div>
            <div class="b-sample" >
              <div ng-repeat="bonus in bonuses" stm-index-bonus="{{bonus.id}}" type="{{bonus.type}}" position="{{bonus.pos}}" timeout="{{bonus.timeout}}"></div>
              <div stm-index-bonus="bonusId3" type="mnogo" position="[350, 50]"></div>
              <div stm-index-bonus="bonusId4" type="sber" position="[450, 50]" timeout="20"></div>
            </div>
        </div>
        <br>
        <div ng-controller="bonusesCtrl">
            <div class="btn" ng-click="show()">Show</div>
            <div class="b-sample __mod1" >
              <div ng-repeat="bonus in bonuses" stm-index-bonus="{{bonus.id}}" type="{{bonus.type}}" position="{{bonus.pos}}" timeout="{{bonus.timeout}}"></div>
              <div stm-index-bonus="bonusId3" type="mnogo" position="[350, 50]"></div>
              <div stm-index-bonus="bonusId4" type="sber" position="[450, 50]" timeout="20"></div>
            </div>
        </div>        
      </file>
      <file name="style.css">
        .b-sample {
            position:relative;
            z-index: 1;
            height: 125px;
            background: #ffd731;
        }
        .b-sample.__mod1 .b-bonus .spinner-css .side > .fill {
          background: white;
        }
      </file>
      <file name="controller.js">
        function bonusesCtrl($scope, $timeout){
            $scope.show = function(){
                $scope.bonuses = [
                    {pos: [50, 50], type: "mnogo", timeout: 10, show: false }, 
                    {pos: [150, 50], type: "sber", timeout: 2 }, 
                    {pos: [250, 50], type: "pickpoint"}
                ];
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
            timeout: '@',
            show: '@'
        },
        // transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonus:template.html',
        controller: ['$scope', '$animate', '$timeout', '$attrs', function($scope, $animate, $timeout, $attrs){
        
            var isHide = $attrs.show ? !$scope.$eval($scope.show) : false;
            
            $scope.hide = true;
            $scope.spinnerEnabled = false;
            
            $scope.$watch('position', function(){
                var position = $scope.$eval($scope.position);
                $scope.css = {
                    left: position[0],
                    top: position[1]
                };
            });
            $scope.$watch('timeout', function(timeout){
                var duration = $scope.$eval($scope.timeout) || timeout;
                $scope.duration = 2 * parseInt(duration, 10);
                if($scope.duration) {
                    $scope.css.border = 'none';
                }
            });
            $scope.$watch('show', function(show){
              if(!('show' in $scope)) return;
              $scope.hide = ($scope.$eval(show) === false) ? true : false;
              if($scope.hide === false) {
                  activateTimeout($scope.stmIndexBonus);
              }              
            });
            $scope.$on('removeBonus-' + $scope.stmIndexBonus, function(){
                $scope.hide = true;
            });
            $scope.$on('showBonus-' + $scope.stmIndexBonus, function(){
                if(!$scope.timeouted) {
                    $scope.hide = false;
                    activateTimeout($scope.stmIndexBonus);
                }
            });

            function activateTimeout(index) {
                if($scope.duration) {
                    $scope.spinnerEnabled = true;
                    $scope.spinnerStyle = { 
                      'animation-duration': $scope.duration + 's'
                    };
                    $timeout(function(){
                        $scope.timeouted = true;
                        $timeout(function(){
                            $scope.hide = true;
                            $scope.$emit('bonusTimeout', index);
                        }, 30);
                    }, $scope.duration / 2 * 1000);
                }
            }
            
            if(!isHide) {
                $timeout(function(){
                    $scope.show = true;
                }, 30);
            }
        }]
    };
});
