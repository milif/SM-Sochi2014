"use strict";
    /**
     * @ngdoc interface
     * @name stmIndex.stmMapAchiev
     * @description
     *
     * Внешний интерфейс достижений на карте
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.stmMapAchiev#add
       * @methodOf stmIndex.stmMapAchiev
       *
       * @description
       * Сохраняет достижение
       *
       * @param {Object} params Данные достижения:
       *
       *   - **`type`** – {String} – Тип достижения
       *            
       */         
    angular.module('stmIndex').factory('stmMapAchiev', ['$resource', function($resource){
        var achievs = [
            { // Нет ачивки
                type: 'pickpoint',
                text: 'PickPoint'
            },
            { // Нет ачивки
                type: 'quelle',
                text: 'Quelle'
            }, 
            { // Нет ачивки
                type: 'proskeyter',
                text: 'Proskeyter'
            },  
            { // Нет ачивки
                type: 'softkey',
                text: 'Софткей'
            },                       
            {
                type: 'caveoffear',
                text: 'Пещера Страха',
                isQuiz: true,
                time: 120
            },
            {
                type: 'maxim',
                text: 'Maxim',
                isQuiz: true,
                time: 120
            },
            {
                type: 'dpd',
                text: 'DPD'
            },            
            {
                type: 'groupon',
                text: 'Groupon'
            },
            {
                type: 'qiwi',
                text: 'Вопрос от Qiwi'
            },
            {
                type: 'mnogo',
                text: 'Mnogo.ru'
            },
            {
                type: 'sotmarket',
                text: 'Сотмаркет'
            },
            {
                type: 'sportexpress',
                text: 'СпортЭкспресс'
            }
        ];
        var keys = {};
        
        for(var i=0;i<achievs.length;i++){
            keys[achievs[i].type] = achievs[i];
            achievs[i].add = add;
        }
    
        var stmMapAchiev = $resource('api/achiev.php');
        
        stmMapAchiev.getByType = getByType;
        stmMapAchiev.total = achievs.length;
        
        return stmMapAchiev;
        
        function add(){
            this.active = true;
            stmMapAchiev.save({
                'key': 'map.' + this.type
            });
        }
        function getByType(type){
            return keys[type];
        }
    }]) 
