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

            var animateElements = {
                'item1': {
                    'element': $element.find('.b-game-item1'),
                    'frames': 16,
                    'fps': 20,
                    'width': 364,
                    'height': 310,
                    'cols': 2
                },
                'item2': {
                    'element': $element.find('.b-game-item2'),
                    'frames': 20,
                    'fps': 30,
                    'width': 170,
                    'height': 200,
                    'cols': 6
                },
                'item3': {
                    'element': $element.find('.b-game-item3'),
                    'frames': 75,
                    'fps': 30,
                    'width': 200,
                    'height': 150,
                    'cols': 5
                },
                'item4': {
                    'element': $element.find('.b-game-item4'),
                    'frames': 117,
                    'fps': 30,
                    'width': 294,
                    'height': 162,
                    'cols': 3
                }
            };

            function iterate(){
                var time = new Date().getTime() - startTime;
                angular.forEach(animateElements, function(item, index) {
                    var frameIndex = Math.round( time / 1000 * item.fps) % item.frames,
                        verticalIndex = Math.floor(frameIndex / item.cols),
                        horizontalIndex = frameIndex - verticalIndex * item.cols;
                    item.element.css({
                        'background-position': '-' + horizontalIndex * item.width + 'px -' + verticalIndex * item.height + 'px'
                    });
                });
            }
        
        }]
    };
}]);
