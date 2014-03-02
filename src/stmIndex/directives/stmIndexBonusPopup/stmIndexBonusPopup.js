"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexBonusPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexBonusPopup:b-bonus-popup.css
 * @requires stmIndex.directive:stmIndexBonusPopup:template.html
 *
 * @description
 * Bonus
 *
 * @element ANY
 * @param {Integer} bonus Кол-во бонусов
 * @param {String} type Тип попапа (sber|mnogo|pickpoint)
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
          <div stm-index-bonus-popup bonus="500" type="pickpoint"></div>
          <br>
          <div stm-index-bonus-popup bonus="1500" type="mnogo"></div>
          <br>
          <div stm-index-bonus-popup bonus="500" type="sber"></div>
          <br>
          <div stm-index-bonus-popup bonus="500" type="qiwi"></div>
          <br>
          <div stm-index-bonus-popup bonus="500" type="dpd"></div>
        <div>
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexBonusPopup', function(){
    var TEXT = {
        'pickpoint': 'Спасибо за упорство от Пикпоинта!',
        'dpd': 'Спасибо за упорство от DPD!',
        'mnogo': 'от Много.ру!',
        'sber': 'Спасибо за упорство от Сбербанка!',
        'qiwi': 'от Qiwi Wallet!'
    }
    return {
        scope: true,
        replace: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexBonusPopup:template.html',
        controller: ['$scope', '$element', '$animate', '$timeout', '$attrs', function($scope, $element, $animate, $timeout, $attrs){
            $attrs.$observe('type', function(type){
                $scope.type = $scope.$eval(type) || type;
                $scope.text = TEXT[type];
            });
            $attrs.$observe('bonus', function(bonus){
                $scope.bonus = $scope.$eval(bonus);
            });
        }]
    };
});
/**
     * @ngdoc service
     * @name stmIndex.$stmBonus
     * @description
     *
     * Сервис раздачи бонусов
     * 
     */
     /**
       * @ngdoc method
       * @name stmIndex.$stmBonus#put
       * @methodOf stmIndex.$stmBonus
       *
       * @description
       * Получение бонуса
       *
       * @param {String} type Тип бонуса
       * @returns {Integer} Сколько бонусов полученно
       */     
     /**
       * @ngdoc method
       * @name stmIndex.$stmBonus#hasAvailable
       * @methodOf stmIndex.$stmBonus
       *
       * @description
       * Наличие бонусов, доступных к получению 
       *
       * @returns {Boolean} `true` если есть доступные к получению бонуса
       */
     /**
       * @ngdoc method
       * @name stmIndex.$stmBonus#getScores
       * @methodOf stmIndex.$stmBonus
       *
       * @description
       * Информация о плученных бонусах
       *
       * @returns {Object} Данные о полученных бонусах, вида:
       *
       *    {
       *         'bonusType': {Integer} // общее число полученных бонусов этого типа
       *    }   
       *      
       */ 
     /**
       * @ngdoc method
       * @name stmIndex.$stmBonus#reset
       * @methodOf stmIndex.$stmBonus
       *
       * @description
       * Сбрасывает информацию о набранных бонусах
       *
       */             
     /**
       * @ngdoc method
       * @name stmIndex.$stmBonus#getAvailableTypes
       * @methodOf stmIndex.$stmBonus
       *
       * @description
       * Набор бонусов, доступных к получению
       *
       * @returns {Array} Массив объектов, следующего вида:
       *
       *   - **`type`** – {String} – Тип бонуса
       *   - **`hasAvailable`** – {Function} – Возможно ли получение бонуса этого типа `Boolean`  
       *   - **`put`** – {Function} – Получение, возвращает сколько бонусов полученно `Integer`
       */
angular.module('stmIndex').factory('$stmBonus', [function(){
    var TYPES = [ // Возможные бонуса и правила их раздачи в играх
        {
            type: 'mnogo',
            hasAvailable: hasAvailableFactory(function(score){
                return true;
            }),
            put: putFactory(function(score){
                return 25;
            })
        },
        {
            type: 'sber',
            hasAvailable: hasAvailableFactory(function(score){
                return true;
            }),
            put: putFactory(function(score){
                return 10;
            })
        },  
        {
            type: 'qiwi',
            hasAvailable: hasAvailableFactory(function(score){
                return true;
            }),
            put: putFactory(function(score){
                return 20;
            })
        },
        {
            type: 'pickpoint',
            hasAvailable: hasAvailableFactory(function(score){
                return true;
            }),
            put: putFactory(function(score){
                return 10;
            })
        },
        {
            type: 'dpd',
            hasAvailable: hasAvailableFactory(function(score){
                return true;
            }),
            put: putFactory(function(score){
                return 10;
            })
        }                 
    ];
    for(var i=0;i<TYPES.length;i++){
        TYPES['_' + TYPES[i].type] = TYPES[i];
    }
    var scores = {};
    var $stmBonus = {
        put: put,
        getScores: getScores,
        hasAvailable: hasAvailable,
        getAvailableTypes: getAvailableTypes,
        reset: reset
    }
    return $stmBonus;
    
    function put(type){
        return TYPES['_' + type].put();
    }
    function putFactory(fn){
        return function(){
            if(!(this.type in scores)) scores[this.type] = 0;
            var score = fn(scores[this.type]);
            scores[this.type] += score;   
            return score;         
        }
    }
    function hasAvailableFactory(fn){
        return function(){
            var score = scores[this.type] || 0;
            return fn(score);            
        }
    }    
    function reset(){
        scores = {};
    }
    function getScores(){
        return angular.copy(scores);
    }
    function hasAvailable(inTypes){
        for(var i=0;i<TYPES.length;i++){
            if(inTypes && inTypes.indexOf(TYPES[i].type) < 0) continue;
            if(TYPES[i].hasAvailable()) return true;
        }
        return false;        
    }
    function getAvailableTypes(inTypes){
        var types = [];
        for(var i=0;i<TYPES.length;i++){
            if(inTypes && inTypes.indexOf(TYPES[i].type) < 0) continue;
            if(TYPES[i].hasAvailable()) {
                types.push(TYPES[i]);
            }
        }
        return types;
    }
}]);       
