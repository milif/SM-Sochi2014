/**
 * @ngdoc filter
 * @name stm.filter:range
 * @function
 *
 * @description
 *   Add items "0" .. "N" to array.
 *
 * @param {integer} range How many items in array
 * @returns {array} Array with items from "0" to "range"
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div ng-repeat="n in [] | range:10">
            do something number {{$index}}
         </div>
      </file>
    </example>
 */
 
angular.module('stm').filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});
