/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexToolbar
 * @function
 *
 * @requires stmIndex.directive:stmIndexToolbar:b-toolbar.css
 * @requires stmIndex.directive:stmIndexToolbar:template.html
 * 
 * @description
 * Страница toolbar
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-toolbar class="example-screen"></div>
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

angular.module('stmIndex').directive('stmIndexToolbar', function(){  
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexToolbar:template.html'
    };
});

