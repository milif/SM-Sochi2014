/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexHellowWorld
 * @function
 *
 * Укажем используемые стили и шаблон
 * @requires stmIndex.directive:stmIndexHellowWorld:b-hellowIndex.css
 * @requires stmIndex.directive:stmIndexHellowWorld:template.html
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
         <div stm-index-hellow-world hellow="World"></div>
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexHellowWorld', function(){
    return {
        scope: {
            name: '@hellow'
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexHellowWorld:template.html',
        compile: function(tElement){
            return function(scope, iElement){
            };
        }
    };
});
