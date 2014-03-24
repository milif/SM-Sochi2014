"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSochiPrice
 * @function
 *
 * @requires stmIndex.directive:stmIndexSochiPrice:b-sochiprice.css
 * @requires stmIndex.directive:stmIndexSochiPrice:template.html
 *
 * @requires stmIndex.stmGoods
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
            <div stm-index-sochi-price></div>
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


angular.module('stmIndex').directive('stmIndexSochiPrice', ['stmGoods', function(stmGoods){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexSochiPrice:template.html'
    };
}]);
