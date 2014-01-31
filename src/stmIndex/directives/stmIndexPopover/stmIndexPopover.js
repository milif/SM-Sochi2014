/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopover
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopover:b-popover.css
 * @requires stmIndex.directive:stmIndexPopover:template.html
 *
 * @description
 * Popover implementation
 *
 * @element ANY
 * @param {String} stmIndexPopover component id 
 * @param {Array} position set position [x, y]
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="popoverCtrl" class="b-sample">
            <div class="btn" ng-click="show()">Show</div>
            <div ng-repeat="popup in popups" stm-index-popover="{{popup.id}}" position="popup.position">
                <div stm-index-bonus-popup bonus="bonus" type="sber">
                    Спасибо за упорство от Сбербанка!
                </div>
            </div>
        </div>
        
      </file>
      <file name="style.css">
      .b-sample {
          position:relative;
          height: 400px;
      }
      </file>
      <file name="controller.js">
        function popoverCtrl($scope, $timeout){
            var popups = $scope.popups = [];
            $scope.show = function(){
                $scope.bonus = Math.round(Math.random() * 200) * 10;
                var popup = {
                    id: new Date().getTime(),
                    position: [50 + Math.random() * 100, 50 + Math.random() * 100],
                    bonus: $scope.bonus
                }
                popups.push(popup);
                $timeout(function(){
                    $scope.$broadcast('hidePopover-' + popup.id);
                }, 3000);
            }
            
            // Подчищаем скрытые попапы
            $scope.$on('hidePopoverSuccess', function(e, id){
                for(var i=0; i<popups.length;i++){
                    if(popups[i].id == id){
                        popups.splice(i,1);
                        break;
                    }
                }
            });
        }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexPopover', function(){
    return {
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexPopover:template.html',
        transclude: true,
        replace: true,
        controller: ['$scope', '$attrs', '$timeout', function($scope, $attrs, $timeout){
        
            $scope.hide = true;            
            
            $attrs.$observe('stmIndexPopover', function(id){
                $scope.id = id;
            /**
               * @ngdoc event
               * @name stmIndex.directive:stmIndexPopover#hidePopover-ID
               * @eventOf stmIndex.directive:stmIndexPopover
               * @eventType local on scope
               * @description
               * Инициирует скрытие компонента 
               * 
               */                
                $scope.$on('hidePopover-' + $scope.id, function(){
                    $scope.hide = true;
                    $timeout(function(){
                    /**
                       * @ngdoc event
                       * @name stmIndex.directive:stmIndexPopover#hidePopoverSuccess
                       * @eventOf stmIndex.directive:stmIndexPopover
                       * @eventType emit on parent scope
                       * @description
                       * Сообщает о завершении скрытия 
                       * 
                       * @param {String} id Id .
                       */                    
                        $scope.$emit('hidePopoverSuccess', $scope.id);
                    }, 500);
                });                
            });
            $attrs.$observe('position', function(position){
                var position = $scope.$eval(position);
                $scope.css = {
                    left: position[0],
                    top: position[1]
                }
            });
        
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.hide = false;
                });                
            }, 30);
        }]
    };
});
