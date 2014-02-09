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
 * @param {Integer} fps set refresh rate for animations
 * @param {Object} position set map position {x: Integer, y: Integer}
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
            position: '=?',
            game: '=?'
        },
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexMap:template.html',
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            
            var storedPosition;
            try { 
                storedPosition = JSON.parse(localStorage.getItem('_stmSochiMapPosition'));
            } catch(e){};
            
            $scope.position = normalizePosition($scope.position || storedPosition || {
                x: 0, 
                y: 0
            });
            
            $scope.$watch('game',function(isGame){
                if(isGame) $scope.$emit('gameInit');
            });
           
            $scope.inMove = false;
            
            var drag;
            var dragEvents = {
                'mousemove': function(e){
                    $scope.$apply(function(){
                        $scope.position = normalizePosition({
                            x: drag.pos.x + drag.x - e.pageX,
                            y: drag.pos.y + drag.y - e.pageY
                        });
                    });
                },
                'mouseup': function(){
                    localStorage.setItem('_stmSochiMapPosition', JSON.stringify($scope.position));
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



            var FPS = $attrs && $attrs.fps || 50;

            var startTime = new Date().getTime();
            var iterator = $interval(function(){
                requestAnimationFrame(iterate);
            }, 1 / FPS * 1000);
            $scope.$on('$destroy', function() {
                $interval.cancel(iterator, false);
            });

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
                'cols': 3,
                'backgroundTop': -324
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
            $scope.item10 = {
                'frames': 71,
                'fps': 30,
                'width': 484,
                'height': 304,
                'cols': 2
            };
            $scope.item11 = {
                'frames': 70,
                'fps': 30,
                'width': 116,
                'height': 134,
                'cols': 8
            };
            $scope.item12 = {
                'frames': 65,
                'fps': 30,
                'width': 350,
                'height': 194,
                'cols': 2
            };
            $scope.item13 = {
                'frames': 69,
                'fps': 30,
                'width': 370,
                'height': 310,
                'cols': 2
            };
            $scope.item14 = {
                'frames': 36,
                'fps': 30,
                'width': 477,
                'height': 106,
                'over': true,
                'move': true,
                'left': -500,
                'cols': 2
            };
            var itemsCount = 14;

            function iterate(){
                var time = new Date().getTime() - startTime;
                for(var index=1; index<=itemsCount; index++) {
                    var item = $scope['item'+index],
                        frameIndex = Math.round( time / 1000 * item.fps) % item.frames,
                        verticalIndex = Math.floor(frameIndex / item.cols),
                        horizontalIndex = frameIndex - verticalIndex * item.cols;
                    if(item.over === true) {
                        item.css = {
                            'background-position': '-' + horizontalIndex * item.width + 'px -' + verticalIndex * item.height + 'px'
                        };
                    } else {
                        item.css = {
                            'background-position': (item.backgroundLeft || 0) + 'px' + (item.backgroundTop || 0) + 'px'
                        };
                    }
                    if(item.move === true) {
                        if(item.left > 4300) {
                            item.left = -500;
                        }
                        item.left += 5;
                        item.css = {
                            'left': item.left + 'px',
                            'background-position': '-' + horizontalIndex * item.width + 'px -' + verticalIndex * item.height + 'px'
                        };
                    }
                }
            }
            function normalizePosition(pos){
                return {
                    x: Math.max(0,Math.min(pos.x, backEl.width() - viewEl.width())),
                    y: Math.max(0,Math.min(pos.y, backEl.height() - viewEl.height()))
                };
            }

            $scope.moveView = function(direction) {
                if($scope.inScroll === true) {
                    return;
                }
                $scope.inScroll = true;
                $scope.inMove = true;
                var stepX = viewEl.width() * 0.75,
                    stepY = viewEl.height() * 0.75,
                    timeout = 1000,
                    newPosition;
                switch(direction) {
                    case 'right':
                        newPosition = normalizePosition({
                            x: $scope.position.x + stepX,
                            y: $scope.position.y
                        });
                        $(viewEl).animate({'scrollLeft': newPosition.x}, timeout);
                        break;
                    case 'left':
                        newPosition = normalizePosition({
                            x: $scope.position.x - stepX,
                            y: $scope.position.y
                        });
                        $(viewEl).animate({'scrollLeft': newPosition.x}, timeout);
                        break;
                    case 'up':
                        newPosition = normalizePosition({
                            x: $scope.position.x,
                            y: $scope.position.y - stepY
                        });
                        $(viewEl).animate({'scrollTop': newPosition.y}, timeout);
                        break;
                    case 'down':
                        newPosition = normalizePosition({
                            x: $scope.position.x,
                            y: $scope.position.y + stepY
                        });
                        $(viewEl).animate({'scrollTop': newPosition.y}, timeout);
                        break;
                }
                $timeout(function(){
                    $scope.position = newPosition;
                    $scope.inScroll = false;
                    $scope.inMove = false;
                }, timeout + 100);
            };

            var keyEvents = {
                'keydown': function (e) {
                    e.preventDefault();
                    if (e.keyCode == 87 || e.keyCode == 38) { // "W" || "arrow up"
                        $scope.moveView('up');
                    } else if (e.keyCode == 65 || e.keyCode == 37) { // "A" || "arrow left"
                        $scope.moveView('left');
                    } else if (e.keyCode == 83 || e.keyCode == 40) { // "S" || "arrow down"
                        $scope.moveView('down');
                    } else if (e.keyCode == 68 || e.keyCode == 39) { // "D" || "arrow right"
                        $scope.moveView('right');
                    }
                },
                'keyup': function (e) {
                    if (e.keyCode == 38) {
                        e.preventDefault();
                    }
                }
            };
            var keyObj = $window;
            $(keyObj).on(keyEvents);
        }]
    };
}]);
