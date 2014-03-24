"use strict";
/**
 * @ngdoc service
 * @name stmIndex.$stmAchievs
 *
 * 
 * @description
 * Сервис достижений
 *
 *  
 */

angular.module('stmIndex').factory('$stmAchievs', [function(){ 
                    
    var JOURNALIST_TEXT = 'Расскажи друзьям об игре через социальные сети.<br>Собери самую большую команду и получи специальный приз Игры.';

    var $stmAchievs = {
        'biathlon': [
            {
                type: 'lasthero',
                text: 'Последний герой',
                descr: 'Необходимо проехать не менее 15 км.'          
            },
            {
                type: 'starshooter',
                text: 'Звездный стрелок',
                descr: 'Необходимо заработать не менее 5000 баллов.'         
            },
            {
                type: 'lionheart',
                text: 'Храбрец',
                count: 0,
                descr: 'Необходимо 5 раз сблизиться с йети менее чем на 10 метров,<br>не дав себя поймать.'        
            },                    
            {
                type: 'ironnerves',
                text: 'Железные нервы',
                descr: 'Необходимо проехать более 5 км.'          
            },
            {
                type: 'journalist',
                text: 'Журналист',
                descr: JOURNALIST_TEXT
            }                           
        ],
        'yeti': [   
            {
                type: 'amongstrangers',
                text: 'Свой среди чужих',
                count: 0,
                descr: 'Необходимо сфотографировать не менее 100 йети<br>за одну попытку игры.'       
            }, 
            {
                type: 'olenevod',
                text: 'Оленевод',
                count: 0,
                descr: 'Необходимо сфотографировать не менее 10 оленей<br>за одну попытку игры.'
            },
            {
                type: 'allinclusive',
                text: 'All Inclusive',
                count: 0,
                descr: 'Необходимо сфотографировать всех животных за одну попытку игры.'
            },
            {
                type: 'journalist',
                text: 'Журналист',
                descr: JOURNALIST_TEXT
            }            
        ],
        'climber': [
            {
                type: 'pioneer',
                text: 'Первопроходец',
                descr: 'Необходимо покорить вершину хотя бы один раз.'
            },       
            {
                type: 'resistance',
                text: 'За стойкость',
                descr: 'Набери 300 баллов за одну попытку.'
            },  
            {
                type: 'amateurfauna',
                text: 'Любитель фауны',
                descr: 'Необходимо слазить 5 раз от одного барана до другого<br>в рамках одной попытки.'
            },                       
            {
                type: 'kingofhill',
                text: 'Царь горы',
                descr: 'Необходимо совершить 10 успешных восхождений.'
            },           
            {
                type: 'journalist',
                text: 'Журналист',
                descr: JOURNALIST_TEXT
            }   
        ]
    };
    var total = 0;
    for(var type in $stmAchievs){
        var achievs = $stmAchievs[type];
        var keys = achievs.keys = {};
        for(var i=0;i<achievs.length;i++){
            keys[achievs[i].type] = achievs[i];
            achievs[i].key = type + '.' + achievs[i].type;
            total++;
        }
    }
    $stmAchievs.get = get;
    $stmAchievs.total = total;
    return $stmAchievs;
    
    function get(type){
        var type = type.split('.');
        return $stmAchievs[type[0]] ? $stmAchievs[type[0]].keys[type[1]] : null;
    }

}]);
