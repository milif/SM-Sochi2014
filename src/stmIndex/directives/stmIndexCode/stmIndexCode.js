"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexCode
 * @function
 *
 * @requires stmIndex.directive:stmIndexCode:b-code.css
 * @requires stmIndex.directive:stmIndexCode:template.html
 *
 * @description
 * About
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-code></div>
        </div>
      </file>
      <file name="style.css">
      .b-sample {
          height: 600px;
          overflow: auto;
      }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexCode', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexCode:template.html'
    };
});
