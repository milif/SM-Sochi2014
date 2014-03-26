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
    
        var stmGoods = $resource('api/goods.php?c=:category&o=:offset&l=:limit&s=:order&f=:filters');
        
        stmGoods.getItems = getItems;
        
        return stmGoods;
        
        function getItems(category, filters, offset, limit, order, clbFn){
            var f = [];
            for(var i=0;i<filters.length;i++){
                f.push(filters[i].value);
            }
            return stmGoods.get({
                category: category, 
                offset: offset, 
                limit: limit, 
                order: order,
                filters: f.join(',')
            }, clbFn);
        };
        
    }]) 
