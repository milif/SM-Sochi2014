"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexProductCard
 * @function
 *
 * 
 * @requires stmIndex.directive:stmIndexProductCard:b-product.css
 * @requires stmIndex.directive:stmIndexProductCard:template.html
 *
 * @description
 * Карточка продукта
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-product-card></div>
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


angular.module('stmIndex').directive('stmIndexProductCard', [function(){
    return {
        replace: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexProductCard:template.html',
        controller: ['$scope', '$attrs', '$element', function($scope, $attrs, $element){
            var item = $scope.item = $scope.$eval($attrs.stmIndexProductCard);
            if(!item.saled) {
                var promo = /coupon=([\w\d]+)/.exec(item.url);
                if(promo) item.promo = promo[1];            
            } else {
                item.url = item.url.replace(/.coupon=[\w\d]+/, '');
            }
        }]
    };
}]);
