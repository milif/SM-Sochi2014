/**
 * @ngdoc directive
 * @name stmCabinet.directive:stmCabinetScreen
 * @function
 *
 * @requires stmCabinet.directive:stmCabinetScreen:b-cabinet.css
 * @requires stmCabinet.directive:stmCabinetScreen:template.html
 *
 * @description
 * Экран личного кабинета
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-cabinet-screen class="example-screen"></div>
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

angular.module('stmCabinet').directive('stmCabinetScreen', function(){
     return {
         templateUrl: 'partials/stmCabinet.directive:stmCabinetScreen:template.html'
     };
 });
