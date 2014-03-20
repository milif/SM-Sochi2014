"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexUnsubscribe
 * @function
 *
 * @requires stmIndex.directive:stmIndexConfirmation:b-confirmation.css
 * @requires stmIndex.directive:stmIndexUnsubscribe:template.html
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
            <div stm-index-unsubscribe></div>
        </div>
      </file>
      <file name="style.css">
      .b-sample {
          overflow: auto;
      }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexUnsubscribe', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexUnsubscribe:template.html',
        controller: ['$stmEnv', '$scope', '$interval', '$location', '$http', function($stmEnv, $scope, $interval, $location, $http){
            $scope.msg = $stmEnv.unsubscribeMsg;
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
