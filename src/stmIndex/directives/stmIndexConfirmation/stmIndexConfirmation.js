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
        controller: ['$stmEnv', '$scope', '$interval', '$location', '$http', '$stmAuth', function($stmEnv, $scope, $interval, $location, $http, $stmAuth){
            $scope.admitad = $stmEnv.admitad;
            $scope.actionpay = $stmEnv.actionpay;
            $scope.cityadspix = $stmEnv.cityadspix;
            $scope.userKey = $stmEnv.userKey;
            $scope.msg = $stmEnv.confirmMsg == 1 ? "Вы перешли по устаревшей ссылке, либо ссылка неверная. Если вы считаете, что на странице произошла техническая ошибка, напишите нам, и мы вам поможем." : $stmEnv.confirmMsg;
            $scope.showConfirm = function(){
                if($stmAuth.isAuth) {
                    $scope.$emit('showConfirmPopup', 'send');
                } else {
                    $stmAuth.auth(function(){
                        $scope.$emit('showConfirmPopup', 'send');
                    });
                }
            }
            
            $scope.time = 12;
            var isConfirm = $scope.isConfirm = $stmEnv.isConfirm;
            if($stmEnv.am15) {
                $http.jsonp('//am15.net/pixel.php?f=js&rid=47701');
            }
            if($stmEnv.ad1) {
                $http.jsonp('//t.zm-trk.com/track.js?p=1452&order_id=' + $stmEnv.userKey);
            }
            if($stmEnv.cityadspix) {
                $http.jsonp('https://cityadspix.com/track/'+$stmEnv.userKey+'/ct/q3/c/383?click_id='+$stmEnv.cityadspix+'&md=2');
            }
            if(!isConfirm || /noredirect=1/.test($location.url())) return;
            var endTime = new Date().getTime() + 12000;
            var cancelTimer = $interval(function(){
                var diffTime = endTime - new Date().getTime();
                $scope.time = Math.round(diffTime / 1000);
                if(diffTime < 0) $location.url('/');
            }, 1000);
        }]
    };
});
