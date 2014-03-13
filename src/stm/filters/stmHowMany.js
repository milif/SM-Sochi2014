"use strict";
/**
 * @ngdoc filter
 * @name stm.filter:stmHowMany
 * @function
 *
 * @description
 *  Формирует описание кол-ва в зависимости от целочисленного значения
 *
 * @param {number} number Number to format.
 * @param {string} Текст для одного
 * @param {string} Текст для двух
 * @param {string} Текст для многих
 * @returns {string} Текстовое значение
 *
 */
 
angular.module('stm').filter('stmHowMany', [function() {
    return function(count, one, two, many) {
        count = Math.round(count);
        var tail = count % 100;
        if (tail > 20 || tail < 5) {
            switch (tail % 10) {
                case 1 :
                    many = one;
                    break;
                case 2 :
                case 3 :
                case 4 :
                    many = two;
            }
        }
        return count + many;
    };
}]);
