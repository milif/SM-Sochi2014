/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexMap
 * @function
 *
 * @requires stmIndex.directive:stmIndexMap:b-map.css
 * @requires stmIndex.directive:stmIndexMap:template.html
 *
 * @description
 * Карта
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-map class="example-map"></div>
      </file>
      <file name="style.css">
         .example-map {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexMap', ['$window', function($window){

    var $ = angular.element;
    var windowEl = $($window);

    return {
        scope: {
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexMap:template.html',
        controller: ['$scope', '$element', function($scope, $element){
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            
            $scope.position = {
                x: 0, 
                y: 0
            }
            $scope.inMove = false;
            
            var drag;
            var dragEvents = {
                'mousemove': function(e){
                    $scope.$apply(function(){
                        $scope.position = {
                            x: Math.max(0,Math.min(drag.pos.x + drag.x - e.pageX, backEl.width() - viewEl.width())),
                            y: Math.max(0,Math.min(drag.pos.y + drag.y - e.pageY, backEl.height() - viewEl.height()))
                        }                    
                    });
                },
                'mouseup': function(){
                    $scope.$apply(function(){
                        $scope.inMove = false;
                    });                    
                    windowEl.off(dragEvents);
                }
            }            
            
            $element.on('mousedown', function(e){
                e.preventDefault();
                windowEl.on(dragEvents);
                drag = {
                    x: e.pageX,
                    y: e.pageY,
                    pos: $scope.position
                }
                $scope.$apply(function(){
                    $scope.inMove = true;
                });
            });
            $scope.$watch('position', function(){
                var position = $scope.position;
                viewEl.scrollLeft(position.x);
                viewEl.scrollTop(position.y);
            });
        
        }]
    };
}]);
