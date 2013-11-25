/**
 * @requires jquery/jquery.js
 * @requires angular/angular.js
 *
 * @requires stm:bootstrap.css
 *
 * @ngdoc overview
 * @name stm
 * @description
 *
 * Модуль приложения
 */

var appModule = angular.module('stm',[])
        .config(['$provide',function($provide){
        }]);

/**
 * @ngdoc function
 * @name stm.defineDirective
 * @function
 *
 * @description
 * Создает директиву в базовом модуле. Все директивы должны быть созданны через вызов `defineDirective`.
 *
 * @param {string} name Name of the directive in camel-case. (ie ngBind which will match as ng-bind).
 * @param {function} defineDirective An injectable directive factory function. See {@link http://docs.angularjs.org/guide/directive guide/directive} for more info.
 */
function defineDirective(name, directiveFactory){
    appModule.directive(name, directiveFactory);
}
/**
 * @ngdoc function
 * @name stm.defineFactory
 * @function
 *
 * @description
 * Создает фабрику службы в базовом модуле. Все фабрики служб должны быть созданны через вызов `defineFactory`.
 *
 * @param {string} name The name of the instance.
 * @param {function} $getFn {function()} – The $getFn for the instance creation. Internally this is a short hand for $provide.provider(name, {$get: $getFn}).
 */
function defineFactory(name, $getFn){
    appModule.factory(name, $getFn);
}
