/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexMapTooltip
 * @function
 *
 * @requires stmIndex.directive:stmIndexMapTooltip:b-mapTooltip.css
 * @requires stmIndex.directive:stmIndexMapTooltip:template.html
 * 
 * @description
 * Страница tooltip
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-map-tooltip class="example-screen"></div>
      </file>
      <file name="style.css">
         .in-plunkr, .in-plunkr body, .in-plunkr .well {
            height: 100%;
            margin: 0;
         }
         .doc-example-live .example-screen {
            height: 500px;
            }
         .example-screen {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: scroll;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexMapTooltip', function(){  
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexMapTooltip:template.html'
    };
});

