/**
 * @ngdoc directive
 * @name stmGameBiathlon.directive:stmGameBiathlonScreen
 * @function
 *
 * @requires stmGameBiathlon.directive:stmGameBiathlonScreen:b-gameEti.css
 * @requires stmGameBiathlon.directive:stmGameBiathlonScreen:template.html
 *
 * @description
 * Экран игры Биатлон
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-biathlon-screen class="example-screen"></div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 100%;
            position: relative;
            overflow:hidden;
            }
      </file>
    </example>
    
 */

angular.module('stmGameBiathlon').directive('stmGameBiathlonScreen', [function(){    
    
    var $ = angular.element;
        
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameBiathlon.directive:stmGameBiathlonScreen:template.html',
        compile: function(tElement){
        },
        controller: [function(){
        }]
    };
}]);
