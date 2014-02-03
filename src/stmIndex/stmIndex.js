/**
 * 
 * @requires stm
 *
 * @ngdoc overview
 * @name stmIndex
 * @description
 *
 * Модуль главной страницы
 */

angular.module('stmIndex', ['stm'])
    .config([function(){
    }])
    /**
     * @ngdoc interface
     * @name stmIndex.Game
     * @description
     *
     * Внешний интерфейс игры
     * 
     */
    /**
       * @ngdoc method
       * @name stmIndex.Game#save
       * @methodOf stmIndex.Game
       *
       * @description
       * Сохраняет результат прохождения игры
       *
       * @param {Object} params Данные игры:
       *
       *   - **`type`** – {String} – Тип игры
       *   - **`data`** – {Object} – Сведения о прохождении игры
       */         
    .factory('Game', ['$resource', '$stmEnv', function($resource, $stmEnv){
        return $resource('api/game.php',{
            'clientId': $stmEnv.clientId
        });
    }]);
 

