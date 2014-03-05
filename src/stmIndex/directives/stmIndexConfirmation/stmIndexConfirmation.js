"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexConfirmation
 * @function
 *
 * @requires stmIndex.directive:stmIndexConfirmation:b-confirmation.css
 * @requires stmIndex.directive:stmIndexConfirmation:template.html
 *
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
        controller: ['$stmEnv', '$scope', '$interval', '$location', function($stmEnv, $scope, $interval, $location){
            $scope.msg = $stmEnv.confirmMsg;
            $scope.time = 12;
            var endTime = new Date().getTime() + 12000;
            var cancelTimer = $interval(function(){
                var diffTime = endTime - new Date().getTime();
                $scope.time = Math.round(diffTime / 1000);
                if(diffTime < 0) $location.url('/');
            }, 1000);
        }]
    };
});
