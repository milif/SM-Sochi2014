/**
 * @ngdoc directive
 * @name stmGameEti.directive:stmGameEtiScreen
 * @function
 *
 * @requires stmGameEti.directive:stmGameEtiScreen:b-gameEti.css
 * @requires stmGameEti.directive:stmGameEtiScreen:template.html
 *
 * @description
 * Экран игры Йети
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-eti-screen class="example-screen"></div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 800px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmGameEti').directive('stmGameEtiScreen', ['$compile', '$rootScope', function($compile, $rootScope){

    var ITERATE_TIMEOUT = 100; // Пауза между итерациями (ms)
    var FIRST_TARGET_TIMEOUT = 3000; // Через какое время появится первая цель (ms)
    var LEVELS_TABLE = [ // Таблица уровней сложности [[ время до от начала игры (s), через какое время исчезает цель (ms), какой интервал между целями (ms), сколько целей одновременно (i)]]
        [60, 3000, 2000, 1],
        [120, 2000, 1500, 1],
        [180, 1500, 1000, 1],
        [240, 1500, 1000, 2],
        [300, 1000, 1000, 2]
    ];
    var MSGS = {
        'in-eti': ['Класс!!!', 'Отличный кадр!', 'white'],
        'out': ['Промах!', 'Будь внимательней', 'red'],
        'in-deer': ['Промах!', 'Ты попал<br>в оленя', 'red']
    };
    
    var $ = angular.element;
    var alertTpl;
    
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameEti.directive:stmGameEtiScreen:template.html',
        compile: function(tElement){
            alertTpl = $compile(tElement.find('[data-alert]').remove());
        },
        controller: ['$scope', '$element', '$interval', '$animate', function($scope, $element, $interval, $animate){
            
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            var targets = viewEl.find('[data-target]');
            
            $scope.position = viewEl.width() / 2;
            
            $element.on('mousemove', function(e){
                $scope.$apply(function(){
                    $scope.position = e.pageX - $element.offset().left;
                });
            });
            $element.on('mousedown', function(e){
                e.preventDefault();
            });
            $element.on('click', function(e){
                photo(e);
            });
            $scope.$watch('position', function(){
                var viewW = viewEl.width();
                var backW = backEl.width();
                var marginW = viewW * 0.15;
                
                var offset= Math.min(viewW-2*marginW, Math.max($scope.position - marginW, 0));
                var scrollLeft = Math.round(offset * (backW-viewW)/(viewW - marginW * 2));
                viewEl.scrollLeft(scrollLeft);
            });
            
            $scope.$on('$destroy', function() {
                stopGame();
            });
            
            var stopGame;
            var gameTime;
            var currentTargets = [];
            var currentLevel = LEVELS_TABLE[0];
            var nextTargetTime = new Date().getTime() + FIRST_TARGET_TIMEOUT;
            var successMsg = MSGS['in-eti'];
            var outMsg = MSGS['out'];
            
            startGame();
            
            function startGame(){
                var startTime = new Date().getTime();
                stopGame = $interval(function(){
                    gameTime = new Date().getTime() - startTime;
                    gameIterate();
                }, ITERATE_TIMEOUT);
            }
            function gameIterate(){
                var time = new Date().getTime();
                
                if(gameTime > currentLevel[0] * 1000){
                    currentLevel = LEVELS_TABLE[LEVELS_TABLE.indexOf(currentLevel) + 1] || currentLevel;
                }
                
                for(var i=0;i<currentTargets.length;i++){
                    var currentTarget = currentTargets[i];
                    if(currentTarget.endTime < time) {
                        closeTarget(currentTarget);
                    }
                }
                
                if(currentTargets.length < currentLevel[3]){
                    if(nextTargetTime < time){
                        var hiddenTargets = targets.filter(':hidden');
                        var el = hiddenTargets.eq(Math.round(Math.random() * hiddenTargets.length));
                        var target = {
                            el: el,
                            endTime: time + (currentLevel[1] * 0.7 + Math.random() * currentLevel[1] * 0.6),
                            animCls: 'state_show',
                            isMove: el.data('move')
                        };
                        if(target.isMove) target.el.css('transition-duration', Math.round((target.endTime - time) / 1000) + 's');
                        $animate.addClass(el, target.animCls, function(){
                            if(target.isMove) target.el.removeClass(target.animCls);
                        });

                        el.data('target', target);
                        currentTargets.push(target);
                    }                   
                }
            }
            function closeTarget(target){
                if(!target.isMove) $animate.removeClass(target.el, target.animCls);
                currentTargets.splice(currentTargets.indexOf(target),1);
                nextTargetTime = new Date().getTime() + (currentLevel[2] * 0.7 + Math.random() * currentLevel[2] * 0.6);                
            }
            function photo(e){
                var success = false;
                targets.filter(':visible').each(function(){
                    var el = $(this);                    
                    
                    if(inEl(el, e)) {
                        var hoverEl = el.closest('[data-hover]');
                        if(hoverEl.length == 0 || inEl(hoverEl, e)){
                            var target = el.data('target');    
                            if(!target.hasShoot){
                                target.hasShoot = true;
                                if(el.data('eti')) {
                                    showMessage(successMsg, e);
                                } else {
                                    var msg = MSGS[el.data('msg')] || ['Промах!', el.data('msg'), 'red'];
                                    showMessage(msg, e);
                                }
                            }
                            success = true;
                            return false;                        
                        }
                    }
                });
                if(!success){
                    showMessage(outMsg, e);
                }
            }
            function showMessage(msg, e){
                var $scope = $rootScope.$new();
                var offsetLeft = viewEl.offset().left;
                var leftOrRight = offsetLeft + viewEl.width() / 2 < e.pageX;
                
                $scope.msg = msg;
                $scope.left = e.pageX - offsetLeft + viewEl.scrollLeft() + (leftOrRight ? -300 : 100);
                $scope.top = viewEl.height() / 2 - Math.round(Math.random() * 200);
                                
                alertTpl($scope, function(el){
                    el.appendTo(viewEl);
                    $animate.leave(el);
                });
            }
            function stopGame(){
                $interval.cancel(stopGame);
            }
            
            function inEl(el, e){
                var offset = el.offset();
                var width = el.width();
                var height = el.height();
                return offset.left < e.pageX && offset.left + width > e.pageX && offset.top < e.pageY && offset.top + height > e.pageY;
            }
        }]
    };
}]);
