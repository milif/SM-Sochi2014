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
                    
    var JOURNALIST_TEXT = 'Расскажи друзьям об игре через социальные сети.<br>Необходимо, чтобы по вашей ссылке зарегистрировалось не менее 5 друзей.';

    var $stmAchievs = {
        'biathlon': [
            {
                type: 'journalist',
                text: 'Журналист',
                descr: JOURNALIST_TEXT
            },
            {
                type: 'ironnerves',
                text: 'Железные нервы',
                descr: 'Необходимо проехать более 5 км.'          
            },
            {
                type: 'lionheart',
                text: 'Храбрец',
                count: 0,
                descr: 'Необходимо 5 раз сблизиться с йети менее чем на 10 метров,<br>не дав себя поймать.'        
            },
            {
                type: 'lasthero',
                text: 'Последний герой',
                descr: 'Необходимо продержаться в игре не менее 15 минут.'          
            },
            {
                type: 'starshooter',
                text: 'Звездный стрелок',
                descr: 'Необходимо поразить не менее 100 мишений.'         
            }                  
        ],
        'yeti': [
            {
                type: 'journalist',
                text: 'Журналист',
                descr: JOURNALIST_TEXT
            },    
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
            }
        ],
        'climber': [
            {
                type: 'journalist',
                text: 'Журналист',
                descr: JOURNALIST_TEXT
            },
            {
                type: 'resistance',
                text: 'За стойкость',
                descr: 'Продержись не менее 3х минут на канате.'
            },
            {
                type: 'pioneer',
                text: 'Первопроходец',
                descr: 'Необходимо покорить вершину хотя бы один раз.'
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
            }    
        ]
    };
    for(var type in $stmAchievs){
        var achievs = $stmAchievs[type];
        var keys = achievs.keys = {};
        for(var i=0;i<achievs.length;i++){
            keys[achievs[i].type] = achievs[i];
        }
    }
    return $stmAchievs;

}]);
