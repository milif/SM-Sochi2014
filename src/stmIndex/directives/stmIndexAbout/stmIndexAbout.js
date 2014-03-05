"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexAbout
 * @function
 *
 * @requires stmIndex.directive:stmIndexAbout:b-about.css
 * @requires stmIndex.directive:stmIndexAbout:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
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
            <div stm-index-about></div>
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


angular.module('stmIndex').directive('stmIndexAbout', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexAbout:template.html'
    };
});
