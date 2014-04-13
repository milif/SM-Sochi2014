"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexAskGoods
 * @function
 *
 * @requires stmIndex.directive:stmIndexAskGoods:ask-goods.css
 * @requires stmIndex.directive:stmIndexAskGoods:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
 *
 * @description
 * ask-goods
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-ask-goods></div>
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


angular.module('stmIndex').directive('stmIndexAskGoods', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexAskGoods:template.html'
    };
});
