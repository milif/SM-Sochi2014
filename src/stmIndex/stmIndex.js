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
       * Сохраняет данные о прохождении игры
       *
       * @param {Object} params Данные игры:
       *
       *   - **`type`** – {String} – Тип игры
       *   - **`action`** – {String} – Действие в игре   
       *   - **`data`** – {Object} – Сведения о действии в игре
       */         
    .factory('Game', ['$resource', '$stmEnv', function($resource, $stmEnv){
        return $resource('api/game.php');
    }]);
 

