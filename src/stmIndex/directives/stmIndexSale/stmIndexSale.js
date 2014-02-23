/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSale
 * @function
 *
 * @requires stmIndex.directive:stmIndexSale:b-sale.css
 * @requires stmIndex.directive:stmIndexSale:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
 *
 * @description
 * Sale
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-sale></div>
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


angular.module('stmIndex').directive('stmIndexSale', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexSale:template.html'
    };
});
