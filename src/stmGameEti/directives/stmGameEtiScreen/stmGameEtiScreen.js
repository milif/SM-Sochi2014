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

angular.module('stmGameEti').directive('stmGameEtiScreen', function(){

    var ITERATE_TIMEOUT = 100; // Пауза между итерациями (ms)
    var FIRST_TARGET_TIMEOUT = 3000; // Через какое время появится первая цель (ms)
    var TIME_TABLE = [
        [60, ]
    ]; // Таблица сложности [[ время от начала игры (s), через какое время исчезает цель (ms), какой интервал между целями (ms), сколько целей одновременно (i)]]
    
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameEti.directive:stmGameEtiScreen:template.html',
        controller: ['$scope', '$element', '$interval', function($scope, $element, $interval){
            
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            var targets = viewEl.find('[data-target]');
            
            $scope.position = viewEl.width() / 2;
            
            $element.on('mousemove', function(e){
                $scope.$apply(function(){
                    $scope.position = e.pageX - $element.offset().left;
                });
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
            
            startGame();
            
            var stopGame;
            var currentTarget;
            var nextTargetTime = new Date().getTime() + FIRST_TARGET_TIMEOUT;
            
            function startGame(){
                stopGame = $interval(function(){
                    $scope.$apply(gameIterate);
                }, ITERATE_TIMEOUT);
                iterateGame();
            }
            function gameIterate(){
                var time = new Date().getTime();
                if(currentTarget){
                    if(currentTarget.endTime < time) {
                        currentTarget.el.removeClass('state_show');
                        currentTarget = null;
                    }
                } else {
                    if(nextTargetTime < time){
                        currentTarget = {
                            el: targets.eq(Math.round(Math.random() * targets.length)),
                            endTime: 
                        }
                        currentTarget.el.addClass('state_show');
                    }
                }
            }
            function stopGame(){
                $interval.cancel(stopGame);
            }
        }]
    };
});
