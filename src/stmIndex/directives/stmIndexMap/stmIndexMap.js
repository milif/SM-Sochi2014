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

angular.module('stmIndex').directive('stmIndexMap', ['$timeout', '$interval', '$document', '$window', function($timeout, $interval, $document, $window){

    var $ = angular.element;
    var windowEl = $($window);

    return {
        scope: {
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexMap:template.html',
        controller: ['$scope', '$element', function($scope, $element, attrs){
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



            var FPS = attrs && attrs.fps || 60;

            var startTime = new Date().getTime();
            $scope.$on('$destroy', function() {
                $interval.cancel(iterator);
            });
            iterator = $interval(function(){
                requestAnimationFrame(iterate);
            }, 1 / FPS * 1000);

            $scope.item1 = {
                'frames': 16,
                'fps': 20,
                'width': 364,
                'height': 310,
                'cols': 2
            };
            $scope.item2 = {
                'frames': 20,
                'fps': 30,
                'width': 170,
                'height': 200,
                'cols': 6
            };
            $scope.item3 = {
                'frames': 75,
                'fps': 30,
                'width': 200,
                'height': 150,
                'cols': 5
            };
            $scope.item4 = {
                'frames': 117,
                'fps': 30,
                'width': 294,
                'height': 162,
                'cols': 3
            };
            $scope.item5 = {
                'frames': 29,
                'fps': 30,
                'width': 200,
                'height': 150,
                'cols': 5
            };
            $scope.item6 = {
                'frames': 30,
                'fps': 30,
                'width': 200,
                'height': 150,
                'cols': 5
            };
            $scope.item7 = {
                'frames': 40,
                'fps': 30,
                'width': 170,
                'height': 150,
                'cols': 6
            };
            $scope.item8 = {
                'frames': 30,
                'fps': 30,
                'width': 170,
                'height': 180,
                'cols': 6
            };
            $scope.item9 = {
                'frames': 55,
                'fps': 30,
                'width': 186,
                'height': 172,
                'cols': 5
            };
            var itemsCount = 9;

            function iterate(){
                var time = new Date().getTime() - startTime;
                for(var index=1; index<=itemsCount; index++) {
                    var item = $scope['item'+index],
                        frameIndex = Math.round( time / 1000 * item.fps) % item.frames,
                        verticalIndex = Math.floor(frameIndex / item.cols),
                        horizontalIndex = frameIndex - verticalIndex * item.cols;
                    item.css = {
                        'background-position': '-' + horizontalIndex * item.width + 'px -' + verticalIndex * item.height + 'px'
                    };
                }
            }
        
        }]
    };
}]);
