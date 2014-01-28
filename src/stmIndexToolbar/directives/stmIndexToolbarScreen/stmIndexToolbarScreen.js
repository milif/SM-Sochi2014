/**
 * @ngdoc directive
 * @name stmIndexToolbar.directive:stmIndexToolbarScreen
 * @function
 *
 * @requires stmIndexToolbar.directive:stmIndexToolbarScreen:b-toolbar.css
 * @requires stmIndexToolbar.directive:stmIndexToolbarScreen:template.html
 * 
 * @description
 * Страница toolbar
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-toolbar-screen class="example-screen"></div>
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

angular.module('stmIndexToolbar').directive('stmIndexToolbarScreen', function(){  
    return {
        templateUrl: 'partials/stmIndexToolbar.directive:stmIndexToolbarScreen:template.html'
    };
});

