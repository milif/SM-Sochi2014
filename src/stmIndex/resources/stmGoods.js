"use strict";
    /**
     * @ngdoc interface
     * @name stmIndex.stmGoods
     * @description
     *
     * Внешний интерфейс товаров
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.stmGoods#getItems
       * @methodOf stmIndex.stmGoods
       *
       * @description
       * Выборка товаров
       *            
       */         
    angular.module('stmIndex').factory('stmGoods', ['$resource', function($resource){
    
        var stmGoods = $resource('api/goods.php');
        
        stmGoods.getItems = getItems;
        
        return stmGoods;
        
        function getItems(p, clbFn){
            var params = {
                c: p.category,
                p: Math.floor(p.offset / p.limit)
            }
            for(var type in p.filters){
                params[type.replace('.', '_')] = p.filters[type];
            }            
            return stmGoods.get(params, clbFn);
        };
        
    }]) 
