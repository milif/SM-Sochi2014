"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSochiPrice
 * @function
 *
 * @requires stm.filter:range
 * 
 * @requires stmIndex.directive:stmIndexSochiPrice:b-sochiprice.css
 * @requires stmIndex.directive:stmIndexSochiPrice:template.html
 *
 * @requires stmIndex.stmGoods
 * @requires stmIndex.directive:stmIndexProductCard
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
    var MENU = [
        {
            type: 'home',
            title: 'Товары для дома',
            isRoot: true
        },
        {
            type: 'soft',
            title: 'Софт'
        },
        {
            type: 'clothing',
            title: 'Одежда и обувь'
        }
    ];
    
    var $ = angular.element;
    
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexSochiPrice:template.html',
        controller: ['$scope', '$stmEnv', '$element', '$timeout', '$location', function($scope, $stmEnv, $element, $timeout, $location){
        
            $element.css('backgroundColor', '#fff');
        
            var goodsParams = $stmEnv.goods;
            var filters = goodsParams.filters;
            for(var i=0;i<MENU.length;i++){
                if(MENU[i].type == goodsParams.category){
                    $scope.category = MENU[i];
                    break;
                }                
            }
            
            $scope.menu = MENU;
            
            var urlParams = [];
            if(goodsParams.category != 'home') {
                urlParams.push('c=' + goodsParams.category);
            }            
            for(var i=0;i<filters.values.length;i++){
                filters.values[filters.values[i].type] = filters.values[i];
                if(filters.values[i].value){
                    urlParams.push(filters.values[i].type.replace('.', '_')+'=' + filters.values[i].value);
                }
            }            
            
            var priceSel = $scope.priceSel = filters.items['f.price'];
            priceSel.type = 'f.price';
            setSelected(priceSel, filters.values['f.price'].value);
            var discountSel = $scope.discountSel = filters.items['f.discount'];
            discountSel.type = 'f.discount';
            setSelected(discountSel, filters.values['f.discount'].value);
            
            
            $scope.urlParams = function(params){
                params = urlParams.concat(params || []);
                return params.length > 0 ? '?' + params.join('&') : '';
            }
            $scope.select = function(sel, item){
                if(sel.selected == item) return;
                sel.selected = item;
                for(var i=0;i<urlParams.length;i++){
                    if(urlParams[i].indexOf(sel.type.replace('.', '_')) >= 0) {
                        urlParams.splice(i, 1);
                        break;
                    }
                }
                if(item.value != null) urlParams.push(sel.type.replace('.', '_') + '=' + item.value);
                window.location.href = 'price/' + $scope.urlParams();
            }
            $scope.showDropdown = function(sel){
                if(sel.active) return;
                var closeEvent = {
                    'click': function(){
                        $(document).off(closeEvent);
                        sel.active = false;
                        $scope.$digest();
                    }
                }
                $timeout(function(){
                    $(document).on(closeEvent);
                }, 0);  
                sel.active = true;       
                             
            }
            $scope.goods = stmGoods.getItems(goodsParams.category, filters.values, goodsParams.offset, goodsParams.limit, goodsParams.order, function(){
                $scope.lastPage = Math.ceil($scope.goods.total / goodsParams.limit) - 1;
                $scope.page = Math.floor(goodsParams.offset / goodsParams.limit);
                
                var range = 7;
                
                var pageLeft = Math.max(0, Math.min($scope.lastPage, $scope.page + (range - 1) / 2) - range + 1);
                var pageRight = Math.min($scope.lastPage, pageLeft + range - 1);
                $scope.pageRange = [pageLeft, pageRight];
            });
        }]
    };
    
    function setSelected (sel, value){
        for(var i=0;i<sel.length;i++){
            if(sel[i].value == value){
                sel.selected = sel[i];
                break;
            }
        }
    }
}]);
