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
            {
                type: 'pickpoint',
                text: 'PickPoint',
                isQuiz: true,
                time: 120
            },
            { // Нет ачивки
                type: 'quelle',
                text: 'Quelle',
                isQuiz: true,
                time: 120
            }, 
            /*
            { // Нет ачивки
                type: 'proskeyter',
                text: 'Proskeyter',
                isQuiz: true,
                time: 120
            },  
            { // Нет ачивки
                type: 'softkey',
                text: 'Софткей',
                isQuiz: true,
                time: 120
            },                       
            */
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
                text: 'DPD',
                isQuiz: true,
                time: 120
            },            
            {
                type: 'groupon',
                text: 'Groupon',
                isQuiz: true,
                time: 120
            },
            {
                type: 'qiwi',
                text: 'Вопрос от Qiwi',
                isQuiz: true,
                time: 120
            },
            {
                type: 'mnogo',
                text: 'Mnogo.ru',
                isQuiz: true,
                time: 120
            },
            {
                type: 'sotmarket',
                text: 'Сотмаркет',
                isQuiz: true,
                time: 120
            },
            {
                type: 'sportexpress',
                text: 'СпортЭкспресс',
                isQuiz: true,
                time: 120
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
