/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexMapPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexMapPopup:b-mapPopup.css
 * @requires stmIndex.directive:stmIndexMapPopup:template.html
 * 
 * @description
 * Страница popup
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-map-popup class="example-screen"></div>
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

angular.module('stmIndex').directive('stmIndexMapPopup', function(){  
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexMapPopup:template.html'
    };
});

