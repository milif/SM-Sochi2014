"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSochiPrice
 * @function
 *
 * @requires stm.filter:range
 * @requires stm.filter:stmHowMany
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
        controller: ['$scope', '$stmEnv', '$element', '$timeout', '$location', '$rootScope', '$q', '$stmAuth', function($scope, $stmEnv, $element, $timeout, $location, $rootScope, $q, $stmAuth){
        
            $element.css('backgroundColor', '#fff');
        
            var goodsParams = $scope.goodsParams = $stmEnv.goods.params;
            var filterValues = goodsParams.filters;
            
            var filters;  
            var goods;          
            
            $scope.menu = MENU;
            $scope.userData = $stmEnv.userData;
            $scope.hasPermission = $stmEnv.hasPermission;
            $scope.auth = function(){
                $stmAuth.auth(function(){
                    window.location.reload();
                });
            }  
                     
            var baseUrl = $scope.baseUrl = $location.url().replace(/[\?#].*?$/,'').replace(/^\//, '');
            
            $scope.isAuth = $stmAuth.isAuth;
            $scope.getUrl = getUrl;
            
            $rootScope.$on('$locationChangeSuccess', function(e, url){
                var params = $location.search();
                goodsParams.offset = params.p ? parseInt(params.p) * goodsParams.limit : 0;
                goodsParams.category = params.c ? params.c : 'home';
                filterValues['f.price'] = params.f_price || null;
                filterValues['f.discount'] = params.f_discount || null;
            });
            
            $scope.doFilter = function(type, item){
                setSelected(type, item);
                var params = {p: 0};
                params[type] = item.value;
                $location.url(getUrl(params));                     
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
            var isGoodsInit = false;
            var cancelLoaderTimeout;
            var loadedGoods;
            $scope.$watch('goodsParams', function(){          
                if(isGoodsInit) {
                    if(loadedGoods) $q.reject(loadedGoods.$promise);
                    loadedGoods = stmGoods.getItems(goodsParams, function(){
                        $scope.goods = goods = loadedGoods;
                        onUpdateGoods();
                    });
                    $timeout.cancel(cancelLoaderTimeout);
                    cancelLoaderTimeout = $timeout(function(){
                        $scope.isGoodsLoading = true;
                    }, 500);                    
                    loadedGoods.$promise.finally(function(){
                        $timeout.cancel(cancelLoaderTimeout);
                        $scope.isGoodsLoading = false;
                    });
                } else {
                    $scope.goods = goods = $stmEnv.goods;
                    onUpdateGoods();
                    isGoodsInit = true;
                }
                          
                for(var i=0;i<MENU.length;i++){
                    if(MENU[i].type == goodsParams.category){
                        $scope.category = MENU[i];
                        break;
                    }                
                }           
            }, true);

            function onUpdateGoods(){
                
                $scope.filters = filters = goods.filters;                          
            
                $scope.lastPage = Math.ceil(goods.items.total / goodsParams.limit) - 1;
                $scope.page = Math.floor(goodsParams.offset / goodsParams.limit);
                
                for(var type in filters){
                    setSelected(filters[type], filterValues[type]);              
                } 
                
                var range = 7;
                      
                var pageLeft = Math.max(0, Math.min($scope.lastPage, $scope.page + (range - 1) / 2) - range + 1);
                var pageRight = Math.min($scope.lastPage, pageLeft + range - 1);
                $scope.pageRange = [pageLeft, pageRight];         
            }
            function getUrl(params){
                
                params = params || {};
            
                var urlParams = [];
                if(goodsParams.category != 'home') {
                    urlParams.push('c=' + goodsParams.category);
                } 
                var v;
                for(var type in filterValues){
                    v = type in params ? params[type] : filterValues[type];
                    if(v){
                        urlParams.push(type.replace('.', '_')+'=' + v);
                    }
                }
                
                var page = Math.floor(goodsParams.offset / goodsParams.limit);
                
                if('p' in params ? params.p > 0 : page > 0) {
                    urlParams.push('p=' + (params.p ? params.p : page));
                }
                
                return baseUrl + (urlParams.length > 0 ? '?' + urlParams.join('&') : '');
            }        

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
