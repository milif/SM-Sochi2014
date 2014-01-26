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



            var fps = attrs && attrs.fps || 60;
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !$window.requestAnimationFrame; ++x) {
                $window.requestAnimationFrame = $window[vendors[x] + 'RequestAnimationFrame'];
                $window.cancelAnimationFrame = $window[vendors[x] + 'CancelAnimationFrame'] || $window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!$window.requestAnimationFrame) $window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 1000/fps - (currTime - lastTime));
                var id = $window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            if (!$window.cancelAnimationFrame) $window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };


            var animateEl1 = $element.find('.b-game-item1'),
                animateEl1Time = 0,
                animateEl1SpriteHorizontal = 0,
                animateEl1SpriteVertical = 0,
                animateEl1Fn = function() {
                    if(animateEl1SpriteHorizontal > 1) {
                        animateEl1SpriteHorizontal = 0;
                        animateEl1SpriteVertical++;
                    }
                    if(animateEl1SpriteVertical > 7) {
                        animateEl1SpriteVertical = 0;
                    }
                    var currTime = new Date().getTime();
                    if(currTime - animateEl1Time > 1000 / 30) {                        
                        animateEl1.css({
                            'background-position': '-' + animateEl1SpriteHorizontal * 360 + ' -' + animateEl1SpriteVertical * 310 + 'px'
                        });
                        animateEl1SpriteHorizontal++;
                        animateEl1Time = currTime;
                    }
                    requestAnimationFrame(animateEl1Fn);
                };
            requestAnimationFrame(animateEl1Fn);


            var animateEl2 = $element.find('.b-game-item2'),
                animateEl2Time = 0,
                animateEl2SpriteHorizontal = 0,
                animateEl2SpriteVertical = 0,
                animateEl2Fn = function() {
                    if(animateEl2SpriteHorizontal > 5) {
                        animateEl2SpriteHorizontal = 0;
                        animateEl2SpriteVertical++;
                    }
                    if(animateEl2SpriteVertical > 3) {
                        animateEl2SpriteVertical = 0;
                    }
                    if(animateEl2SpriteVertical === 3 && animateEl2SpriteHorizontal > 1) {
                        animateEl2SpriteVertical = 0;
                        animateEl2SpriteHorizontal = 0;
                    }                    
                    var currTime = new Date().getTime();
                    if(currTime - animateEl2Time > 1000 / fps) {
                        animateEl2.css({
                            'background-position': '-' + animateEl2SpriteHorizontal * 170 + ' -' + animateEl2SpriteVertical * 200 + 'px'
                        });
                        animateEl2SpriteHorizontal++;
                        animateEl2Time = currTime;
                    }
                    requestAnimationFrame(animateEl2Fn);
                };
            requestAnimationFrame(animateEl2Fn);


            var animateEl3 = $element.find('.b-game-item3'),
                animateEl3Time = 0,
                animateEl3SpriteLeft = 900,
                animateEl3SpriteHorizontal = 0,
                animateEl3SpriteVertical = 0,
                animateEl3Fn = function() {
                    if(animateEl3SpriteHorizontal > 4) {
                        animateEl3SpriteHorizontal = 0;
                        animateEl3SpriteVertical++;
                    }
                    if(animateEl3SpriteVertical > 14) {
                        animateEl3SpriteVertical = 0;
                    }
                    var currTime = new Date().getTime();
                    if(currTime - animateEl3Time > 1000 / fps) {
                        animateEl3.css({
                            'left': animateEl3SpriteLeft,
                            'background-position': '-' + animateEl3SpriteHorizontal * 200 + ' -' + animateEl3SpriteVertical * 150 + 'px'
                        });
                        if(animateEl3SpriteVertical > 1 && animateEl3SpriteVertical < 8) {
                            animateEl3SpriteLeft -= 3;
                        } else if(animateEl3SpriteVertical > 8) {
                            animateEl3SpriteLeft += 3;
                        }                        
                        animateEl3SpriteHorizontal++;
                        animateEl3Time = currTime;
                    }
                    requestAnimationFrame(animateEl3Fn);
                };
            requestAnimationFrame(animateEl3Fn);



            var animateEl4 = $element.find('.b-game-item4'),
                animateEl4Time = 0,
                animateEl4SpriteLeft = 1100,
                animateEl4SpriteHorizontal = 0,
                animateEl4SpriteVertical = 0,
                animateEl4Fn = function() {
                    if(animateEl4SpriteHorizontal > 2) {
                        animateEl4SpriteHorizontal = 0;
                        animateEl4SpriteVertical++;
                    }
                    if(animateEl4SpriteVertical > 38) {
                        animateEl4SpriteVertical = 0;
                    }
                    var currTime = new Date().getTime();
                    if(currTime - animateEl4Time > 1000 / fps) {
                        animateEl4.css({
                            'left': animateEl4SpriteLeft,
                            'background-position': '-' + animateEl4SpriteHorizontal * 294 + ' -' + animateEl4SpriteVertical * 162 + 'px'
                        });
                        if(animateEl4SpriteVertical > 1 && animateEl4SpriteVertical < 20) {
                            animateEl4SpriteLeft += 3;
                        } else if(animateEl4SpriteVertical > 20) {
                            animateEl4SpriteLeft -= 3;
                        }                        
                        animateEl4SpriteHorizontal++;
                        animateEl4Time = currTime;
                    }
                    requestAnimationFrame(animateEl4Fn);
                };
            requestAnimationFrame(animateEl4Fn);

        
        }]
    };
}]);
