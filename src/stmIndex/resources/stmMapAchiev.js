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
                type: 'yetiwanted',
                text: 'Плакат Йети',
                isQuest: true,
                descr: 'Найти на карте<br>все плакаты Йети'
            },
            {
                type: 'yeti',
                text: 'Сыщик Йети',
                isQuest: true,
                descr: 'Найти на карте<br>всех Йети'
            },
            {
                type: 'horns',
                text: 'Все рогатые',
                isQuest: true,
                descr: 'Найти на карте<br>всех рогатых'
            },
            {
                type: 'actually',
                text: 'Я в деле',
                isQuest: true,
                descr: 'Найти на карте<br>всех, кто "в деле"'
            },
            {
                type: 'pickpoint',
                text: 'PickPoint',
                isQuiz: true,
                time: 120,
                descrFrom: '«PickPoint»'
            },
            {
                type: 'quelle',
                text: 'Quelle',
                isQuiz: true,
                time: 120,
                descrFrom: 'магазина «Quelle»'
            }, 
            { // Нет ачивки
                type: 'proskeyter',
                text: 'Proskeyter',
                isQuiz: true,
                time: 120
            },  
            /*
            { // Нет на карте
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
                time: 120,
                descrFrom: 'Всеволода Страха'
            },
            {
                type: 'maxim',
                text: 'Maxim',
                isQuiz: true,
                time: 120,
                descrFrom: 'журнала «Maxim»'
            },
            {
                type: 'sotmarket',
                text: 'Сотмаркет',
                isQuiz: true,
                time: 120,
                descrFrom: 'магазина «Сотмаркет»'
            },            
            {
                type: 'dpd',
                text: 'DPD',
                isQuiz: true,
                time: 120,
                descrFrom: '«DPD»'
            },            
            {
                type: 'groupon',
                text: 'Groupon',
                isQuiz: true,
                time: 120,
                descrFrom: '«Groupon»'
            },
            {
                type: 'qiwi',
                text: 'Вопрос от Qiwi',
                isQuiz: true,
                time: 120,
                descrFrom: '«Qiwi Wallet»'
            },
            {
                type: 'mnogo',
                text: 'Mnogo.ru',
                isQuiz: true,
                time: 120,
                descrFrom: 'клуба «Много.ру»'
            },
            {
                type: 'sportexpress',
                text: 'СпортЭкспресс',
                isQuiz: true,
                time: 120,
                descrFrom: 'газеты «Спорт-Экспресс»'
            }
            
        ];
        var keys = {};
        
        for(var i=0;i<achievs.length;i++){
            keys[achievs[i].type] = achievs[i];
            achievs[i].add = add;
        }
    
        var stmMapAchiev = $resource('api/achiev.php');
        
        stmMapAchiev.setActive = setActive;
        stmMapAchiev.getAll = getAll;
        stmMapAchiev.getByType = getByType;
        stmMapAchiev.total = achievs.length;
        
        return stmMapAchiev;
        
        function setActive(data){
            for(var i=0;i<achievs.length;i++){
                achievs[i].active = data.indexOf('map.' + achievs[i].type) >= 0;
            }
        }
        function getAll(){
            return achievs;
        }
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
