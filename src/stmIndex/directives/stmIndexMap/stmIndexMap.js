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
         <div game="true" stm-index-map class="example-map"></div>
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

angular.module('stmIndex').directive('stmIndexMap', ['$timeout', '$interval', '$document', '$window', '$rootScope', function($timeout, $interval, $document, $window, $rootScope){

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
            
            $rootScope.$on('toolbarLogoClick', function(){
                $scope.position = {
                    x: 0,
                    y: 0
                }
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
                if($(e.target).closest('[data-controls]').length > 0) return;
                if($scope.inScroll === true) {
                    return;
                }
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
                'cols': 5,
                'circle3': true,
                'left': 1400,
                'dx': 0
            };
            $scope.item4 = {
                'frames': 117,
                'fps': 30,
                'width': 294,
                'height': 162,
                'cols': 3,
                'circle4': true,
                'left': 1570,
                'dx': 0
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
            $scope.item15 = {
                'frames': 86,
                'fps': 30,
                'width': 282,
                'height': 160,
                'cols': 3,
                'over': false,
                'circle15': true,
                'left': 2950,
                'dx': 0
            };
            $scope.item16 = {
                'frames': 73,
                'fps': 30,
                'width': 282,
                'height': 160,
                'cols': 3,
                'over': false,
                'circle16': true,
                'left': 1430,
                'dx': 0
            };
            $scope.item17 = {
                'frames': 16,
                'fps': 30,
                'width': 134,
                'height': 136,
                'cols': 7
            };
            $scope.item18 = {
                'frames': 80,
                'fps': 30,
                'width': 330,
                'height': 120,
                'cols': 3
            };
            $scope.item19 = {
                'frames': 60,
                'fps': 30,
                'width': 200,
                'height': 120,
                'cols': 5
            };
            $scope.item20 = {
                'frames': 23,
                'fps': 30,
                'width': 256,
                'height': 112,
                'cols': 4
            };
            $scope.item21 = {
                'frames': 22,
                'fps': 30,
                'width': 86,
                'height': 56,
                'cols': 11
            };
            $scope.item22 = {
                'frames': 50,
                'fps': 30,
                'width': 196,
                'height': 116,
                'cols': 5
            };
            $scope.item23 = {
                'frames': 76,
                'fps': 30,
                'width': 120,
                'height': 130,
                'cols': 8
            };
            $scope.item24 = {
                'frames': 80,
                'fps': 30,
                'width': 306,
                'height': 210,
                'cols': 3
            };
            $scope.item25 = {
                'frames': 18,
                'fps': 30,
                'width': 132,
                'height': 188,
                'cols': 7
            };
            $scope.item26 = {
                'frames': 39,
                'fps': 30,
                'width': 128,
                'height': 124,
                'cols': 8
            };
            $scope.item27 = {
                'frames': 89,
                'fps': 30,
                'width': 186,
                'height': 116,
                'cols': 5
            };
            $scope.item28 = {
                'frames': 86,
                'fps': 30,
                'width': 154,
                'height': 172,
                'cols': 6,
                'circle28': true,
                'left': 1140,
                'dx': 0
            };
            $scope.item29 = {
                'frames': 17,
                'fps': 30,
                'width': 130,
                'height': 183,
                'cols': 7
            };
            
            var itemsCount = 29;
            for(var index=1; index<=itemsCount; index++) {
                $scope['item'+index]._frameIndex = 0;
            }
            function iterate(){
                var time = new Date().getTime() - startTime;
                for(var index=1; index<=itemsCount; index++) {
                    var item = $scope['item'+index];
                    
                     if(!item.over && item._frameIndex == 0){
                        item._startTime = time;
                     }
                    
                    var frameIndex = Math.round( (item._startTime ? time - item._startTime : time) / 1000 * item.fps) % item.frames,
                        verticalIndex = Math.floor(frameIndex / item.cols),
                        horizontalIndex = frameIndex - verticalIndex * item.cols;
                    
                    item._frameIndex = frameIndex;
                    
                    var isAnimate = item.over === true || frameIndex !=0;
                    
                    if(isAnimate) {
                        item.css = {
                            'background-position': '-' + horizontalIndex * item.width + 'px -' + verticalIndex * item.height + 'px'
                        };
                    } else {
                        item.dx = 0;
                        item.css = {
                            'background-position': '0 0'
                        };
                    }
                    if(item.circle16 === true) {
                        if(isAnimate) {
                            if(frameIndex < 19 || frameIndex > 63) {
                                item.dx++;
                            } else if(frameIndex > 31 && frameIndex < 60) {
                                item.dx--;
                            } 
                            item.left = 1430 - item.dx * 5;
                            item.css.left = item.left + 'px';
                        } else {
                            item.dx = 0;
                        }       
                    }
                    if(item.circle15 === true) {
                        if(isAnimate) {
                            if(frameIndex < 27 || frameIndex > 76) {
                                item.dx++;
                            } else if(frameIndex > 34 && frameIndex < 71) {
                                item.dx--;
                            }
                            item.left = 2950 - item.dx * 5;
                            item.css.left = item.left + 'px';
                        } else {
                            item.dx = 0;
                        }
                    }
                    if(item.circle28 === true) {
                        if(isAnimate) {
                            if(frameIndex < 15 || frameIndex > 76) {
                                item.dx++;
                            } else if(frameIndex > 25 && frameIndex < 50) {
                                item.dx--;
                            }
                            item.left = 1140 - item.dx * 5;
                            item.css.left = item.left + 'px';
                        } else {
                            item.dx = 0;
                        }
                    }
                    if(item.circle3 === true) {
                        if(isAnimate) {
                            if(frameIndex > 10 && frameIndex < 35) {
                                item.dx++;
                            } else if(frameIndex > 50) {
                                item.dx--;
                            }
                            item.left = 1400 - item.dx * 5;
                            item.css.left = item.left + 'px';
                        } else {
                            item.dx = 0;
                        }
                    }
                    if(item.circle4 === true) {
                        if(isAnimate) {
                            if(frameIndex > 63) {
                                item.dx++;
                            } else if(frameIndex > 3 && frameIndex < 57) {
                                item.dx--;
                            }
                            item.left = 1570 - item.dx * 2;
                            item.css.left = item.left + 'px';
                        } else {
                            item.dx = 0;
                        }
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
