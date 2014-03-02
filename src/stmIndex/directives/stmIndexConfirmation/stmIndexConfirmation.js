"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexConfirmation
 * @function
 *
 * @requires stmIndex.directive:stmIndexConfirmation:b-confirmation.css
 * @requires stmIndex.directive:stmIndexConfirmation:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
 *
 * @description
 * Confirmation
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-confirmation></div>
        </div>
      </file>
      <file name="style.css">
      .b-sample {
          overflow: auto;
      }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexConfirmation', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexConfirmation:template.html',
        controller: ['$stmEnv', '$scope', function($stmEnv, $scope){
            $scope.msg = $stmEnv.confirmMsg;
        }]
    };
});
