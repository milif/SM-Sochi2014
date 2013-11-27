/**
 * @ngdoc directive
 * @name stm.directive:stmHellowWorld
 * @function
 *
 * Укажем используемые стили и шаблон
 * @requires stm.directive:stmHellowWorld:b-hellow.css
 * @requires stm.directive:stmHellowWorld:template.html
 *
 * @description
 * Пример компонента
 *
 * @element ANY
 * @param {String} hellow Укажем кого приветствуем.
 *
 * @example
 * Ниже расположен пример использования компонента.
    <example module="appExample">
      <file name="index.html">
         <b>Здравствуй, Мир!</b>
         <div stm-hellow-world hellow="World"></div>
      </file>
    </example>
    
 */

angular.module('stm').directive('stmHellowWorld', function(){
    return {
        scope: {
            name: '@hellow'
        },
        templateUrl: 'partials/stm.directive:stmHellowWorld:template.html',
        compile: function(tElement){
            return function(scope, iElement){
            };
        }
    };
});
