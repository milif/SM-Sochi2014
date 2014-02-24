/**
 * @ngdoc filter
 * @name stm.filter:stmNumber
 * @function
 *
 * @description
 *   Formats a number as text.
 *   If the input is not a number an empty string is returned.
 *
 * @param {number|string} number Number to format.
 * @param {(number|string)=} fractionSize Number of decimal places to round the number to.
 * If this is not provided then the fraction size is computed from the current locale's number
 * formatting pattern. In the case of the default locale, it will be 3.
 * @returns {string} Number rounded to decimalPlaces and places a “,” after each third digit.
 *
 */
 
angular.module('stm').filter('stmNumber', ['$filter', function($filter) {
    var $number = $filter('number');
    return function(number, fractionSize) {
        return $number(number, fractionSize).replace(',',' ');
    };
}]);
