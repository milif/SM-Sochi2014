/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopup:b-popup.css
 * @requires stmIndex.directive:stmIndexPopup:template.html
 *
 * @description
 * Popup
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-popup class="example-popup"></div>
      </file>
      <file name="style.css">
         .example-popup {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexPopup', function(){
    return {
        scope: {
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexPopup:template.html',
        compile: function(tElement){
            return function(scope, iElement){
            };
        }
    };
});
