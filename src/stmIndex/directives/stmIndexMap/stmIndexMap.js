"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexMap
 * @function
 *
 * @requires stmIndex.directive:stmIndexMap:b-map.css
 * @requires stmIndex.directive:stmIndexMap:mapitems.css
 * @requires stmIndex.directive:stmIndexMap:template.html
 * @requires stmIndex.stmMapAchiev
 * @requires stmIndex.directive:stmIndexQuiz
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

angular.module('stmIndex').directive('stmIndexMap', ['$stmEnv', '$window', function($stmEnv, $window){

    var QUIZ = $stmEnv.quiz;

    var $ = angular.element;
    var windowEl = $($window);

    return {
        scope: {
            position: '=?',
            game: '=?'
        },
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexMap:template.html',
        controller: ['$scope', '$element', '$attrs', '$timeout', 'stmMapAchiev', '$interval', '$document', '$rootScope', function($scope, $element, $attrs, $timeout, stmMapAchiev, $interval, $document, $rootScope){
            
            $rootScope.$on('auth', function(){
                window.location.reload();
            });
        
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            backEl.data('_transition', backEl.css('transition'));
            var kPreview = 178 / backEl.width();
            var previewEl = $element.find('[data-preview]');
            var previewConturEl = $element.find('[data-preview-contur]');
            previewConturEl.data('_transition', previewConturEl.css('transition'));
            
            var backCss;
            var storedPosition;
            //var foundedAchievs = {};
            var achievTooltips = {};
            var preview = {};
            
            var drag;
            var inClick = true;
            var cancelHideQuiz = {};
            
            $scope.showQuiz = function(e, noToggle){
                var el = $(e.target).closest('[data-quiz]');
                var type = el.data('quiz');
                var position = el.data('position');
                var isBottom = !!el.data('bottom');
                var key = el.data('key') || type;
                $timeout.cancel(cancelHideQuiz[key]);
                if(key in achievTooltips) {
                    if(!noToggle) $scope.$broadcast('hidePopover-' + key);
                    return;
                };
                addFoundedAchiev(key, type, position, isBottom);
                var mapPosition = $scope.position;
                var posY = isBottom ? position[1] : backEl.height() - position[1];
                $scope.position = {
                    x: Math.min(position[0] - 80, Math.max(mapPosition.x, position[0] + 250 - viewEl.width())), 
                    y: Math.min(posY - 150, Math.max(mapPosition.y, posY + 100 - viewEl.height()))
                };
            }
            $scope.closeQuizPopup = function(){
                $scope.showQuizPopup = false;
            }
            
            $scope.isPreview = true;
            $scope.foundedAchievs = 0;
            $scope.totalAchievs = stmMapAchiev.total;
            
            try { 
                storedPosition = JSON.parse(localStorage.getItem('_stmSochiMapPosition'));
            } catch(e){};
            try { 
                $scope.isPreview = JSON.parse(localStorage.getItem('_stmSochiMapIsPreview'));
            } catch(e){};
            
            $scope.achievTooltips = achievTooltips;
            
            $scope.position = normalizePosition($scope.position || storedPosition || {
                x: 0, 
                y: 0
            });
            $scope.preview = preview;
            $scope.showPreview = function(isPreview){
                $scope.isPreview = isPreview;
                localStorage.setItem('_stmSochiMapIsPreview', JSON.stringify(isPreview));
            }
            $scope.startQuiz = function(e){
                showQuizPopup($(e.target).closest('[data-quiz]').data('quiz'));           
            }
            $scope.enterQuizTooltip = function(key){
                $timeout.cancel(cancelHideQuiz[key]);
            }
            $scope.outQuizTooltip = function(key){
                hideQuizTimeout(key);
            }
            $scope.hideQuiz = function(e){
                var el = $(e.target).closest('[data-quiz]');
                var type = el.data('quiz');
                var key = el.data('key') || type;
                hideQuizTimeout(key);
            }
            $scope.startDragPreview = function(e){
                inClick = true;
                e.preventDefault();
                windowEl.on(dragPreviewEvents);
                drag = {
                    x: e.pageX,
                    y: e.pageY,
                    pos: $scope.position
                }
                $timeout(function(){ 
                    if(!drag) return;
                    $scope.inMovePreview = true;
                }, 50);
            }
            $scope.posMap = function(e){
                if(!inClick) return;
                var offset = previewEl.offset();
                $scope.position = normalizePosition({
                    x: ((e.pageX - offset.left) - preview.css.width / 2) / kPreview,
                    y: ((e.pageY - offset.top) - preview.css.height / 2) / kPreview
                })                
            }
            $scope.$on('quizNext', function(){
                $scope.showQuizPopup = false;
            });     
            $scope.$on('hidePopoverSuccess', function(e, id){
                delete achievTooltips[id];
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
            
            var dragEvents = {
                'mousemove': function(e){
                    removeMapTransition();
                    $scope.$apply(function(){
                        $scope.position = normalizePosition({
                            x: drag.pos.x + drag.x - e.pageX,
                            y: drag.pos.y + drag.y - e.pageY
                        });
                    });
                },
                'mouseup': function(){
                    drag = null;
                    addMapTransition();
                    $scope.$apply(function(){
                        $scope.inMove = false;
                    });
                    windowEl.off(dragEvents);
                }
            }
            var dragPreviewEvents = {
                'mousemove': function(e){
                    inClick = false;
                    removeMapTransition();
                    $scope.$apply(function(){
                        $scope.position = normalizePosition({
                            x: drag.pos.x - (drag.x - e.pageX) / kPreview,
                            y: drag.pos.y - (drag.y - e.pageY) / kPreview
                        });
                    });
                },
                'mouseup': function(){
                    drag = null;
                    $scope.$apply(function(){
                        $scope.inMovePreview = false;
                    });
                    setTimeout(function(){
                        inClick = true;
                    }, 0);
                    addMapTransition();
                    windowEl.off(dragPreviewEvents);
                }
            }          
            
            $element.on('mousedown', function(e){
                var targetEl = $(e.target);
                if(targetEl.closest('[data-controls],[ng-transclude],[data-preview-h],[stm-index-popup]').length > 0 || targetEl.closest('.b-map').length == 0) return;
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
                $timeout(function(){
                    if(!drag) return;
                    $scope.inMove = true;
                }, 50);
            });
            $scope.$watch('position', function(position){
                $scope.backCss = {
                    left: -position.x,
                    top: -position.y
                };
                updatePreview(position);
                localStorage.setItem('_stmSochiMapPosition', JSON.stringify(position));
            });
            function showQuizPopup(type){
                var achiev = stmMapAchiev.getByType(type);
                if(achiev.isQuiz){          
                    var quiz = QUIZ[type];
                    quiz.achiev = achiev;
                    quiz.descr = $element.find('[data-quiz-descr='+type+']').html();
                    $scope.showQuizPopup = quiz;
                }                
            }
            function hideQuizTimeout(key){
                cancelHideQuiz[key] = $timeout(function(){
                    $scope.$broadcast('hidePopover-' + key);
                }, 1500); 
            }           
            function addFoundedAchiev(key, type, position, isBottom){
                var achiev = stmMapAchiev.getByType(type);
                achiev.active = achiev.active || $stmEnv.achievs.indexOf('map.' + type) >= 0;
                achievTooltips[key] = {
                    id: key,
                    achiev: achiev,
                    type: type,
                    isBottom: isBottom,
                    position: position,
                    time: achiev.time,
                    closeQuizTooltip: function(){
                        $scope.$broadcast('hidePopover-' + key);
                    },
                    onClick: function(){
                        showQuizPopup(type);
                    }
                };            
            }
            function removeMapTransition(){
                previewConturEl.css('transition', 'none');
                backEl.css('transition', 'none');
            }
            function addMapTransition(){
                backEl.css('transition', backEl.data('_transition'));
                previewConturEl.css('transition', previewConturEl.data('_transition'));
            }
            function updatePreview(position){
                preview.css = {
                    width: Math.round(viewEl.width() * kPreview),
                    height: Math.round(viewEl.height() * kPreview),
                    left: Math.round(position.x * kPreview),
                    top: Math.round(position.y * kPreview)
                }
            }
            
            function normalizePosition(pos){
                return {
                    x: Math.max(0,Math.min(pos.x, backEl.width() - viewEl.width())),
                    y: Math.max(0,Math.min(pos.y, backEl.height() - viewEl.height()))
                };
            }            
            
            // Animation

            var FPS = $attrs && $attrs.fps || 50;
            var iterator;
            var startTime = new Date().getTime();
            $scope.animate = function(id, active){
                var item = $scope['item'+id];
                item.over = active;
                if(item._frameIndex == 0) item._startTime = new Date().getTime() - startTime;
                $interval.cancel(iterator);
                iterator = $interval(function(){
                    requestAnimationFrame(iterate);
                }, 1 / FPS * 1000);
            }
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
                'over': false, //true,
                'move': false, //true,
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
                'leftStart': 2950,
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
            $scope.item30 = {
                'frames': 80,
                'fps': 30,
                'width': 386,
                'height': 276,
                'cols': 2
            };
            $scope.item31 = {
                'frames': 10,
                'fps': 30,
                'width': 200,
                'height': 230,
                'cols': 5
            };
            $scope.item32 = {
                'frames': 48,
                'fps': 30,
                'width': 250,
                'height': 230,
                'cols': 4
            };
            $scope.item33 = {
                'frames': 40,
                'fps': 30,
                'width': 230,
                'height': 210,
                'cols': 4
            };
            $scope.item34 = {
                'frames': 72,
                'fps': 30,
                'width': 480,
                'height': 230,
                'cols': 2
            };
            $scope.item35 = {
                'frames': 70,
                'fps': 30,
                'width': 950,
                'height': 280,
                'cols': 1
            };   
            $scope.item36 = {
                'frames': 16,
                'fps': 30,
                'width': 150,
                'height': 170,
                'cols': 6
            };
            $scope.item37 = {
                'frames': 24,
                'fps': 30,
                'width': 400,
                'height': 150,
                'cols': 2
            };
            $scope.item38 = {
                'frames': 80,
                'fps': 30,
                'width': 200,
                'height': 138,
                'cols': 5
            };
            $scope.item39 = {
                'frames': 81,
                'fps': 30,
                'width': 290,
                'height': 180,
                'cols': 3
            };
            $scope.item40 = {
                'frames': 12,
                'fps': 30,
                'width': 208,
                'height': 160,
                'cols': 4
            };  
            $scope.item41 = {
                'frames': 64,
                'fps': 30,
                'width': 250,
                'height': 150,
                'cols': 4
            };
            $scope.item42 = {
                'frames': 38,
                'fps': 30,
                'width': 120,
                'height': 130,
                'cols': 8
            };
            $scope.item43 = {
                'frames': 40,
                'fps': 30,
                'width': 240,
                'height': 200,
                'cols': 4
            };
            $scope.item44 = {
                'frames': 50,
                'fps': 30,
                'width': 490,
                'height': 500,
                'cols': 2
            };
            $scope.item45 = {
                'frames': 48,
                'fps': 30,
                'width': 120,
                'height': 120,
                'cols': 8
            }; 
            $scope.item46 = {
                'frames': 48,
                'fps': 30,
                'width': 120,
                'height': 130,
                'cols': 8
            };
            $scope.item47 = {
                'frames': 19,
                'fps': 30,
                'width': 232,
                'height': 134,
                'cols': 4
            };
            $scope.item48 = {
                'frames': 60,
                'fps': 30,
                'width': 136,
                'height': 140,
                'cols': 7
            };
            $scope.item49 = {
                'frames': 102,
                'fps': 30,
                'width': 60,
                'height': 50,
                'cols': 17
            };
            $scope.item50 = {
                'frames': 75,
                'fps': 30,
                'width': 180,
                'height': 120,
                'cols': 5
            };  
            $scope.item51 = {
                'frames': 22,
                'fps': 30,
                'width': 86,
                'height': 56,
                'cols': 11
            };
            $scope.item52 = {
                'frames': 12,
                'fps': 30,
                'width': 90,
                'height': 160,
                'cols': 11
            };
            $scope.item53 = {
                'frames': 56,
                'fps': 30,
                'width': 326,
                'height': 198,
                'cols': 3
            };
            $scope.item54 = {
                'frames': 38,
                'fps': 30,
                'width': 142,
                'height': 184,
                'cols': 7
            };
            $scope.item55 = {
                'frames': 20,
                'fps': 30,
                'width': 118,
                'height': 190,
                'cols': 8
            }; 
            $scope.item56 = {
                'frames': 84,
                'fps': 30,
                'width': 230,
                'height': 214,
                'cols': 4
            };
            $scope.item57 = {
                'frames': 26,
                'fps': 30,
                'width': 550,
                'height': 290,
                'cols': 1
            };  
            $scope.item58 = {
                'frames': 39,
                'fps': 30,
                'width': 314,
                'height': 210,
                'cols': 3
            };
            $scope.item59 = {
                'frames': 86,
                'fps': 30,
                'width': 282,
                'height': 160,
                'cols': 3,
                'over': false,
                'circle15': true,
                'leftStart': 2486,
                'dx': 0
            };                  
                        
            var itemsCount = 59;           
            for(var index=1; index<=itemsCount; index++) {
                $scope['item'+index]._frameIndex = 0;
            }
            function iterate(){
                var time = new Date().getTime() - startTime;
                var hasAnimate = false;
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
                        hasAnimate = true;
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
                            item.left = item.leftStart - item.dx * 5;
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
                if(!hasAnimate) $interval.cancel(iterator);
            }

            $scope.moveView = function(direction) {
                var stepX = viewEl.width() * 0.75,
                    stepY = viewEl.height() * 0.75,
                    timeout = 1000,
                    newPosition;
                switch(direction) {
                    case 'right':
                        newPosition = normalizePosition({
                            x: $scope.position.x + stepX,
                            y: $scope.position.y
                        });;
                        break;
                    case 'left':
                        newPosition = normalizePosition({
                            x: $scope.position.x - stepX,
                            y: $scope.position.y
                        });
                        break;
                    case 'up':
                        newPosition = normalizePosition({
                            x: $scope.position.x,
                            y: $scope.position.y - stepY
                        });
                        break;
                    case 'down':
                        newPosition = normalizePosition({
                            x: $scope.position.x,
                            y: $scope.position.y + stepY
                        });
                        break;
                }
                $scope.position = newPosition;
            };

            var keyEvents = {
                'keydown': function (e) {
                    $scope.$apply(function(){
                        if($(e.target).closest('input, textarea').length > 0) return;
                        if (e.keyCode == 87 || e.keyCode == 38) { // "W" || "arrow up"
                            e.preventDefault();
                            $scope.moveView('up');
                        } else if (e.keyCode == 65 || e.keyCode == 37) { // "A" || "arrow left"
                            e.preventDefault();
                            $scope.moveView('left');
                        } else if (e.keyCode == 83 || e.keyCode == 40) { // "S" || "arrow down"
                            e.preventDefault();
                            $scope.moveView('down');
                        } else if (e.keyCode == 68 || e.keyCode == 39) { // "D" || "arrow right"
                            e.preventDefault();
                            $scope.moveView('right');
                        }                    
                    });
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
