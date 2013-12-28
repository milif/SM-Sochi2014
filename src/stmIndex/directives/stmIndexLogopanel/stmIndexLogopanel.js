/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexLogopanel
 * @function
 *
 * @requires stmIndex.directive:stmIndexLogopanel:b-logopanel.css
 * @requires stmIndex.directive:stmIndexLogopanel:template.html
 *
 * @description
 * logopanel
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div  stm-index-logopanel class="example-logopanel">
        </div>
      </file>
      <file name="style.css">
         .example-logopanel {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexLogopanel', function(){
    return {
        scope: {
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexLogopanel:template.html',
        compile: function(tElement){
            return function(scope, iElement){
            };
        }
    };
});
