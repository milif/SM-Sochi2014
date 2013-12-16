/**
 * @ngdoc directive
 * @name stmGameEti.directive:stmGameEtiScreen
 * @function
 *
 * @requires stmGameEti.directive:stmGameEtiScreen:b-gameEti.css
 * @requires stmGameEti.directive:stmGameEtiScreen:template.html
 *
 * @description
 * Экран игры Альпинист
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
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmGameEti').directive('stmGameEtiScreen', function(){
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameEti.directive:stmGameEtiScreen:template.html',
        compile: function(tElement){
            return function(scope, iElement){
            };
        }
    };
});
