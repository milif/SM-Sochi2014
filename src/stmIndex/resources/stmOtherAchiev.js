"use strict";
    /**
     * @ngdoc interface
     * @name stmIndex.stmOtherAchiev
     * @description
     *
     * Внешний интерфейс остальных достижений
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.stmOtherAchiev#add
       * @methodOf stmIndex.stmOtherAchiev
       *
       * @description
       * Сохраняет достижение
       *
       * @param {Object} params Данные достижения:
       *
       *   - **`type`** – {String} – Тип достижения
       *            
       */         
    angular.module('stmIndex').factory('stmOtherAchiev', ['$resource', function($resource){
        var achievs = [
            {
                type: 'friends',
                text: 'Друганы',
                bonus: 500,
                descrFrom: 'Расскажи о Сочных Играх друзьям'
            }
        ];
        var keys = {};
        
        for(var i=0;i<achievs.length;i++){
            keys[achievs[i].type] = achievs[i];
            achievs[i].add = add;
        }
    
        var stmOtherAchiev = $resource('api/achiev.php');
        
        stmOtherAchiev.setActive = setActive;
        stmOtherAchiev.getAll = getAll;
        stmOtherAchiev.getByType = getByType;
        stmOtherAchiev.total = achievs.length;
        
        return stmOtherAchiev;
        
        function setActive(data){
            for(var i=0;i<achievs.length;i++){
                achievs[i].active = data.indexOf('other.' + achievs[i].type) >= 0;
            }
        }
        function getAll(){
            return achievs;
        }
        function add(){
            this.active = true;
            stmMapAchiev.save({
                'key': 'other.' + this.type
            });
        }
        function getByType(type){
            return keys[type];
        }
    }]) 
