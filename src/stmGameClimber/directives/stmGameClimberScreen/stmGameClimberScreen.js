/**
 * @ngdoc directive
 * @name stmGameClimber.directive:stmGameClimberScreen
 * @function
 *
 * @requires stmGameClimber.directive:stmGameClimberScreen:b-gameClimber.css
 * @requires stmGameClimber.directive:stmGameClimberScreen:template.html
 *
 * @description
 * Экран игры Альпинист
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-climber-screen class="example-screen"></div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */
angular.module('stmGameClimber').directive('stmGameClimberScreen',['$timeout', '$interval', '$document', '$window', function($timeout, $interval, $document, $window){
    return {
        templateUrl: 'partials/stmGameClimber.directive:stmGameClimberScreen:template.html',
        controller: function($scope, $element, $attrs) {
          $scope.endPosition = 0;
          $scope.score = 0;          
          $scope.energy = 100;
          $scope.distance = 0;
          $scope.$watch('distance', function() {
              $scope.distancePercent = $scope.distance / $scope.endPosition * 100;
              $scope.distanceMeters = $scope.distance / 100;
          });
        },
        compile: function (tElement) {
            return function (scope, iElement) {
                function init() {
                    var $ = angular.element,
                        g_pipeEl = iElement.find('.gameClimber-fone-h'),
                        g_viewEl = iElement.find('.b-gameClimber-h'),

                        keyObj = $window,

                        manEl = g_pipeEl.find('.gameClimber-player'),
                        state = 0,
                        action = 'stop',
                        manualTimeout,

                        attempts = 5 + Math.round(Math.random() * 5),

                        isFirst = true,
                        moveInterval,
                        doDownTimeout,
                        infoTimeout,
                        inScroll = false,

                        isGameStart = false,
                        isUpPressed = false,
                        canBreakDown,
                        clicksCount = 0,
                        clicksIntervalCount = 0,
                        clicksRatioIntervalMs = 1000,
                        clicksRatio = 3,

                        startPosition = parseInt(manEl.css('bottom'), 10),
                        endPosition = g_pipeEl.height(),
                        topPipeMargin = 1050,
                        spacePosition = endPosition * 0.7,
                        capPosition = endPosition * 0.35,
                        position = startPosition,
                        downPosition,
                        downPositionStop,
                        fromPosition,

                        blockUI = false,
                        blockUpEvents = {
                            'keydown': function (e) {
                                if (e.keyCode == 38) {
                                    e.preventDefault();
                                }
                            }
                        },
                        keyEvents = {
                            'keydown': function (e) {
                                if (e.keyCode == 38) {
                                    e.preventDefault();
                                    if (action == 'down' && !canBreakDown) return;
                                    if (!isUpPressed) {
                                        clicksCount++;
                                        _up();
                                        var energyIncrement = Math.pow(clicksIntervalCount - clicksRatio, 2);
                                        energyIncrement = Math.min(Math.max(0.2, energyIncrement / 10), 2);
                                        updateEnergy(-energyIncrement);
                                    }
                                    isUpPressed = true;

                                    var ratio = (position - startPosition) / (endPosition - startPosition),
                                        step = 400;
                                    if (ratio > 0.75) {
                                        step = 180;
                                    } else if (ratio > 0.60) {
                                        step = 200;
                                    } else if (ratio > 0.30) {
                                        step = 300;
                                    }

                                    _down(step, true);
                                }
                            },
                            'keyup': function (e) {
                                if (e.keyCode == 38) {
                                    isUpPressed = false;
                                    e.preventDefault();
                                }
                            }
                        };

                    scope.endPosition = endPosition;

                    function updateEnergy(incrementValue) {
                        scope.energy = Math.min(Math.max(0, scope.energy + incrementValue), 100);
                    }

                    function updateDistance(incrementValue) {
                        scope.distance = Math.min(Math.max(0, scope.distance + incrementValue), endPosition);
                        scope.distancePercent = scope.distance / (endPosition - topPipeMargin) * 100;
                    }
                    
                    function _play(){
                        $timeout(function(){
                            g_viewEl.stop();
                            inScroll = true;
                            g_viewEl.animate({
                                scrollTop: endPosition
                            }, 1500, null, function () {
                                inScroll = false;
                            });
                        }, 500);

                        $interval(function(){
                            clicksIntervalCount = clicksCount;
                            clicksCount = 0;
                        }, clicksRatioIntervalMs);
                        
                        isGameStart = true;
                        manEl
                            .removeClass('mod_frame'+state)
                            .addClass('mod_frame14');
                        state = 14;
                        _updateDownPosition();
                        isFirst = false;

                        $(keyObj)
                            .off(keyEvents)
                            .off(blockUpEvents)
                            .on(keyEvents);        
                    }

                    function blockUserEvents(timeToBlock) {
                        timeToBlock = timeToBlock || 3000;
                        $timeout(function () {
                            $(keyObj)
                                .off(blockUpEvents)
                                .off(keyEvents)
                                .on(blockUpEvents);
                        }, 0);
                        blockUI = true;
                        $timeout(function () {
                            $(keyObj)
                                .off(keyEvents)
                                .off(blockUpEvents)
                                .on(keyEvents);
                            blockUI = false;
                        }, timeToBlock);
                    }

                    function _updateDownPosition(){
                        downPosition = 1850 + Math.round(2000 * Math.random());  
                        downPositionStop = downPosition - Math.round(1850 * Math.random());
                    }
                    function _up() {
                        _stop();
                        var step = 30,
                            ratio = (position - startPosition) / (endPosition - startPosition);
                        clicksRatio = 4;

                        if (ratio > 0.75) {
                            step = 2.5;
                            scope.score = 1500;
                            clicksRatio = 5;
                        } else if (ratio > 0.50) {
                            step = 5;
                            scope.score = 1000;
                            clicksRatio = 4;
                        } else if (ratio > 0.30) {
                            step = 7.5;
                            scope.score = 500;
                            clicksRatio = 5;
                        } else if (ratio > 0.20) {
                            step = 15;
                            clicksRatio = 4;
                        }

                        position += step;
                        scope.$apply(function() {
                          updateDistance(step);
                        });

                        $timeout.cancel(manualTimeout);

                        _update();

                        action = 'up';
                    }

                    function _down(timeout, _canBreakDown) {
                        $timeout.cancel(doDownTimeout);
                        if (timeout) {
                            doDownTimeout = $timeout(function () {
                                _down(null, _canBreakDown);
                            }, timeout);
                            return;
                        }
                        _stop();
                        canBreakDown = _canBreakDown;
                        fromPosition = position;
                        moveInterval = $interval(function () {
                            position -= 8;
                            if (!canBreakDown && downPositionStop > position) {
                                canBreakDown = true;
                                _updateDownPosition();
                            }
                            updateEnergy(0.7);
                            updateDistance(-8);
                            _update();
                        }, 10);
                        action = 'down';
                    }

                    function _stop() {
                        canBreakDown = false;
                        $interval.cancel(moveInterval);
                        action = 'stop';
                    }

                    function _update() {

                        position = Math.min(Math.max(startPosition, position), endPosition);

                        var newstate;

                        if (action == 'up' || action == 'stop') {
                            if (state < 10) {
                                newstate = state + 1;
                            } else {
                                newstate = 1;
                            }
                        } else if (action == 'down') {
                            newstate = 15;
                        }

                        if (position == startPosition) newstate = action == 'down' ? (fromPosition > 200 ? 
                            (fromPosition > spacePosition ? 9 : ( fromPosition > capPosition ? 5 : 14 ) )
                        : 1) : 1;
                        else if(position >= (endPosition - topPipeMargin)) newstate = 14;

                        if (state != newstate) {
                            manEl
                                .removeClass('mod_frame' + state)
                                .addClass('mod_frame' + newstate);
                            state = newstate;
                        }
                        
                        if(position >= (endPosition - topPipeMargin)) {
                            manEl.css({
                              'bottom': endPosition - topPipeMargin + 364,
                              'margin-left': 90
                            });
                        } else {
                            manEl.css({
                                'bottom': action == 'down' ? position : Math.max(startPosition, Math.floor(position / 30) * 30 - 30),
                                'margin-left': -178
                            });
                        }
                        _setScroll();

                        var ratio = (position - startPosition) / (endPosition - startPosition);

                        if ((position == startPosition) && (scope.energy < 70)) {
                            $interval(function(){
                                updateEnergy(3);
                            }, 100, 10);
                            blockUserEvents(1000);
                        }

                        if(scope.energy === 0) {
                            blockUserEvents(1500);
                        }

                        if (attempts > 0 && downPosition < position) {
                            attempts--;
                            $timeout(function () {
                                _down();
                            }, 0);
                            return;
                        }

                        if (position == startPosition || position >= (endPosition - topPipeMargin)) {
                            _stop();
                            if (position >= (endPosition - topPipeMargin)) {
                                $timeout(function () {
                                    $(keyObj)
                                        .off(keyEvents)
                                        .on(blockUpEvents);
                                    $timeout.cancel(doDownTimeout);
                                }, 0);
                            }
                        }
                    }

                    function _setScroll(){                        
                        if(position >= (endPosition - topPipeMargin)) {
                             g_viewEl.stop().animate({
                                scrollTop: 200
                            }, 200);
                            return;
                        }
                        
                        if(inScroll) return;
                    
                        var viewHeight = g_viewEl.height(),
                            pipeHeight = g_pipeEl.height(),
                            scrollTo;

                        var _position = pipeHeight - position;                        
                        if( action == 'down' ) {
                            scrollTo = _position - viewHeight / 2;
                        } else {
                            scrollTo = _position - viewHeight;
                        }
                        
                        if(Math.abs( scrollTo - g_viewEl.scrollTop()) > viewHeight / 4 ) {
                            g_viewEl.stop();
                            inScroll = true;
                            g_viewEl.animate({
                                scrollTop: scrollTo
                            }, 200, null, function(){
                                inScroll = false;
                            });
                        }
                    }
                    _play();
                }
                init();
            };
        }
    };
}]);
