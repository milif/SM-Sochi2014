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
 * Страница цен
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
        templateUrl: 'partials/stmIndex.directive:stmIndexSochiPrice:template.html',
        controller: ['$scope', '$stmEnv', function($scope, $stmEnv){
            var goodsParams = $stmEnv.goods;
            $scope.goods = stmGoods.getItems(goodsParams.category, goodsParams.offset, goodsParams.limit, goodsParams.order, function(){
                $scope.lastPage = Math.ceil($scope.goods.total / goodsParams.limit) - 1;
                $scope.page = Math.floor(goodsParams.offset / goodsParams.limit); 
            });
        }]
    };
}]);
