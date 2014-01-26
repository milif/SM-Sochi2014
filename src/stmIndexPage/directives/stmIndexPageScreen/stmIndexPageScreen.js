/**
 * @ngdoc directive
 * @name stmIndexPage.directive:stmIndexPageScreen
 * @function
 *
 * @requires stmIndexPage.directive:stmIndexPageScreen:b-IndexPage.css
 * @requires stmIndexPage.directive:stmIndexPageScreen:template.html
 * 
 * @description
 * Главная страница
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-page-screen class="example-screen"></div>
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
            overflow: hidden;
            }
      </file>
    </example>
    
 */

angular.module('stmIndexPage').directive('stmIndexPageScreen', function(){  
    return {
        templateUrl: 'partials/stmIndexPage.directive:stmIndexPageScreen:template.html'
    };
});

