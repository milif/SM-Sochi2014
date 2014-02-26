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

    var $stmAchievs = {
        'biathlon': [
            {
                type: 'journalist',
                text: 'Журналист'
            },
            {
                type: 'ironnerves',
                text: 'Железные нервы'            
            },
            {
                type: 'lionheart',
                text: 'Храбрец',
                count: 0            
            },
            {
                type: 'lasthero',
                text: 'Последний герой'            
            },
            {
                type: 'starshooter',
                text: 'Звездный стрелок'            
            }                  
        ],
        'yeti': [
            {
                type: 'journalist',
                text: 'Журналист'
            },    
            {
                type: 'amongstrangers',
                text: 'Свой среди чужих',
                count: 0            
            }, 
            {
                type: 'olenevod',
                text: 'Оленевод',
                count: 0            
            },
            {
                type: 'allinclusive',
                text: 'All Inclusive',
                count: 0
            }
        ],
        'climber': [
            {
                type: 'journalist',
                text: 'Журналист'
            },
            {
                type: 'resistance',
                text: 'За стойкость'
            },
            {
                type: 'pioneer',
                text: 'Первопроходец'
            },
            {
                type: 'amateurfauna',
                text: 'Любитель фауны'
            },
            {
                type: 'kingofhill',
                text: 'Царь горы'
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
