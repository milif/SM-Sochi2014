/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexToolbar
 * @function
 *
 * @requires stmIndex.directive:stmIndexToolbar:b-toolbar.css
 * @requires stmIndex.directive:stmIndexToolbar:template.html
 * 
 * @description
 * Страница toolbar
 *
 * @element ANY
 *
 * @param {String} position position of toolbar (bottom|top)
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-toolbar></div>
      </file>
      <file name="style.css">
         .in-plunkr, .in-plunkr body, .in-plunkr .well {
            height: 100%;
            margin: 0;
         }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexToolbar', function(){  
    return {
        replace: true,
        scope: {
            position: '=?'
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexToolbar:template.html',
        controller: ['$scope', '$attrs', function($scope, $attrs){
            $scope.position = $scope.position || $attrs.position || 'bottom';
        }]
    };
});

