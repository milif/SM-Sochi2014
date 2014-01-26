/**
 * @ngdoc directive
 * @name stmGameClimber.directive:stmGameClimberScreen
 * @function
 *
 * @requires stmGameClimber.directive:stmGameClimberScreen:b-gameClimber.css
 * @requires stmGameClimber.directive:stmGameClimberScreen:template.html
 * @requires stmIndex.directive:stmIndexPopup
 *
 * @description
 * Экран игры Альпинист
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-climber-screen difficulty="simple" class="example-screen"></div>
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
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          $scope.endPosition = 0;
          $scope.score = 0;
          $scope.scoreIncrement = 0;
          $scope.popupScoreShow = false;
          $scope.popupMoodShow = false;
          $scope.energy = 100;
          $scope.distance = 0;
          $scope.$watch('distance', function() {
              $scope.distancePercent = $scope.distance / $scope.endPosition * 100;
              $scope.distanceMeters = $scope.distance / 100;
          });
          $scope.showStartPopup = true;
          $scope.showToolbar = false;
        }],
        compile: function (tElement) {
            return function (scope, iElement, attrs) {
                function init() {                    
                    var $ = angular.element,
                        difficulty = attrs.difficulty,
                        g_pipeEl = iElement.find('.gameClimber-fone-h'),
                        g_viewEl = iElement.find('.b-gameClimber-h'),

                        keyObj = $window,

                        manEl = g_pipeEl.find('.gameClimber-player'),
                        birdEl = g_pipeEl.find('.gameClimber-bird'),
                        birdElPositionLeft = parseInt(birdEl.css('left'), 10),
                        birdElPositionTop = parseInt(birdEl.css('top'), 10),
                        moodPopupEl = g_pipeEl.find('.gameClimber-popup-mood'),
                        scorePopupEl = g_pipeEl.find('.gameClimber-popup-score'),
                        state = 0,
                        action = 'stop',
                        manualTimeout,

                        attempts = 5 + Math.round(Math.random() * 5),

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
                        oneFourthPosition = endPosition * 0.25,
                        position = startPosition,
                        downPosition,
                        downPositionStop,
                        fromPosition,
                        moodPopupUsed = false,

                        goingUp = false,
                        goingUpUsed = false,
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
                                } else if (e.keyCode == 82) { // "R"
                                    var ratio = (position - startPosition) / (endPosition - startPosition);
                                    if(!goingUpUsed && ratio > 0.65 && (position < endPosition - topPipeMargin - 150)) {
                                        goingUpUsed = true;
                                        $timeout(function () {
                                            $(keyObj)
                                                .off(blockUpEvents)
                                                .off(keyEvents)
                                                .on(blockUpEvents);
                                        }, 0);
                                        blockUI = true;
                                        goingUp = true;
                                        manEl
                                            .removeClass('mod_frame'+state)
                                            .addClass('mod_frame17');
                                        state = 17;
                                        var index = 0;
                                        var upInterval = $interval(function(){
                                            position += 10;
                                            _up();
                                            scope.$apply(function() {
                                              updateDistance(10);
                                            });
                                            $timeout.cancel(manualTimeout);
                                            _update();
                                            action = 'up';
                                            updateEnergy(1);
                                            index++;
                                            if(index == 100 || position > endPosition - topPipeMargin - 150) {
                                                $interval.cancel(upInterval);
                                                manEl
                                                    .removeClass('mod_frame17')
                                                    .addClass('mod_frame30');
                                                state = 30;
                                                $(keyObj)
                                                    .off(keyEvents)
                                                    .off(blockUpEvents)
                                                    .on(keyEvents);
                                                blockUI = false;                                                
                                                goingUp = false;
                                            }
                                        }, 50, 100);
                                    }
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
                    
                    function startGame() {

                        scope.score = 0;
                        scope.scoreIncrement = 0;
                        scope.energy = 100;
                        scope.distance = 0;
                        scope.showStartPopup = false;
                        scope.showToolbar = true;
                        moodPopupUsed = false;
                        goingUpUsed = false;
                        attempts = 5 + Math.round(Math.random() * 5);
                        clicksCount = 0;
                        clicksRatio = 3;

                        birdEl.css({
                            'top': 0,
                            'left': birdElPositionLeft,
                            'margin-left': ''
                        });

                        $timeout(function(){
                            manEl.css({
                                'margin-left': '',
                                'bottom': position
                            });
                        }, 1000);

                        $timeout(function(){
                            g_viewEl.stop();
                            inScroll = true;
                            g_viewEl.animate({
                                scrollTop: endPosition
                            }, 1500, null, function () {
                                inScroll = false;
                                $('.gameClimber-popup').css({'left': '50%'});
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

                        $timeout(function(){
                            $(keyObj)
                                .off(keyEvents)
                                .off(blockUpEvents)
                                .on(keyEvents);
                        }, 2000);
                    }

                    function stopGame() {
                        $(keyObj)
                            .off(blockUpEvents)
                            .off(keyEvents)
                            .on(blockUpEvents);
                        $timeout(function(){
                            position = startPosition;
                            scope.showToolbar = false;
                            scope.showStartPopup = true;
                        }, 1000);
                    }

                    scope.play = function(){
                        scope.showStartPopup = false;
                        $timeout(function(){
                            startGame();
                        }, 0);
                    };

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

                    function showScorePopup(score) {
                        if(score <= scope.score) {
                            return;
                        }
                        scope.scoreIncrement = score - scope.score;
                        scope.popupScoreShow = true;
                        $timeout(function() {
                            scope.popupScoreShow = false;
                        }, 5000);
                    }                    

                    function showMoodPopup() {
                        if(moodPopupUsed) {
                            return;
                        }
                        moodPopupUsed = true;
                        scope.popupMoodShow = true;
                        $timeout(function() {
                            scope.popupMoodShow = false;
                        }, 7000);
                    }

                    function _up() {
                        _stop();
                        var step = 30,
                            ratio = (position - startPosition) / (endPosition - startPosition);
                        clicksRatio = 4;
                        if (ratio > 0.7) {
                            showMoodPopup();
                        }

                        if (ratio > 0.75) {
                            step = 2.5;
                            showScorePopup(1500);
                            scope.score = 1500;
                            clicksRatio = 5;
                        } else if (ratio > 0.50) {
                            step = 5;
                            showScorePopup(1000);
                            scope.score = 1000;
                            clicksRatio = 4;
                        } else if (ratio > 0.30) {
                            step = 7.5;
                            showScorePopup(500);
                            scope.score = 500;                            
                            clicksRatio = 5;
                        } else if (ratio > 0.20) {
                            step = 15;
                            clicksRatio = 4;
                        }

                        if(difficulty === 'simple' && !goingUp) {
                            step = 50;
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
                        if(goingUp) {
                            return;
                        }
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
                            if(fromPosition > spacePosition) {
                                if (state >= 21 && state < 30) {
                                    newstate = state + 1;
                                } else {
                                    newstate = 21;
                                }
                            } else {
                                if (state < 10) {
                                    newstate = state + 1;
                                } else {
                                    newstate = 1;
                                }
                            }
                        } else if (action == 'down') {
                            newstate = 25;
                        }

                        if (position == startPosition) {
                            newstate = action == 'down' ?
                            ( fromPosition > oneFourthPosition ? 15 : 14 ) : 14;
                        }

                        if (state != newstate && !goingUp) {
                            manEl
                                .removeClass('mod_frame' + state)
                                .addClass('mod_frame' + newstate);
                            state = newstate;
                        }
                        
                        if(position >= (endPosition - topPipeMargin)) {
                            moveBird();
                        } else {
                            manEl.css({
                                'bottom': action == 'down' ? position : Math.max(startPosition, Math.floor(position / 30) * 30 - 30)
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

                    function _setScroll(setScrollPosition){
                        
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
                                scrollTop: setScrollPosition || scrollTo
                            }, 200, null, function(){
                                inScroll = false;
                            });
                        }
                    }

                    function moveBirdAndMan() {
                        var positionBottom = parseInt(manEl.css('bottom'), 10),
                            positionMarginLeft = parseInt(manEl.css('margin-left'), 10),
                            _index = 0;

                        var timerUp = $interval(function(){
                            _index += 1;
                            positionBottom += 2;
                            positionMarginLeft += 1.3;
                            position += 1.5;
                            manEl.css({
                                'margin-left': positionMarginLeft,
                                bottom: positionBottom
                            });
                            _setScroll();
                            if(_index === 210) {
                                $interval.cancel(timerUp);
                                manEl
                                    .removeClass('mod_frame16')
                                    .addClass('mod_frame14')
                                    .css({
                                      'bottom': endPosition - topPipeMargin + 364
                                    });
                                state = 14;
                                moveBirdAway(positionMarginLeft);
                            }
                        }, 10);
                    }

                    function moveBird() {
                        var positionLeft = parseInt(birdEl.css('left'), 10),
                            positionTop = parseInt(birdEl.css('top'), 10);

                        _setScroll(200);

                        $timeout(function(){
                            _setScroll();
                        }, 1000);

                        var timer = $interval(function(){
                            positionLeft += 0.2;
                            positionTop += 2.5;
                            birdEl.css({
                                left: positionLeft + '%',
                                top: positionTop
                            });                            
                            if(positionLeft > 35) {
                                birdEl.addClass('open');
                            } else {
                                birdEl.removeClass('open');
                            }
                            if(positionLeft > 49) {
                                $interval.cancel(timer);
                                manEl
                                    .removeClass('mod_frame'+state)
                                    .addClass('mod_frame16');
                                state = 16;
                                birdEl.hide();
                                moveBirdAndMan();
                            }
                        }, 10);
                    }

                    function moveBirdAway(positionMarginLeft) {
                        positionTop = 285;
                        birdEl.css({
                            'margin-left': positionMarginLeft,
                            top: positionTop
                        });
                        birdEl.show();
                        var timer = $interval(function(){
                            positionMarginLeft += 2.5;
                            positionTop -= 2.5;
                            birdEl.css({
                                'margin-left': positionMarginLeft,
                                top: positionTop
                            });
                            if(positionTop < 150) {
                                birdEl.removeClass('open');
                            }
                            if(positionTop < -500) {
                                $interval.cancel(timer);
                                stopGame();
                            }
                        }, 10);
                    }

                    g_viewEl.scrollTop(100);

                }
                init();
            };
        }
    };
}]);
