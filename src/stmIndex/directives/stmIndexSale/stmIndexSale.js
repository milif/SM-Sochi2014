"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSale
 * @function
 *
 * @requires stmIndex.directive:stmIndexSale:b-sale.css
 * @requires stmIndex.directive:stmIndexSale:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
 * @requires stmIndex.directive:stmIndexSocialLike
 * @requires stmIndex.directive:stmIndexPopup
 * @requires stmIndex.directive:stmIndexProductCard
 *
 * @description
 * Sale
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-sale></div>
        </div>
      </file>
      <file name="style.css">
      .b-sample {
          height: 600px;
          overflow: auto;
      }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexSale', function(){
    var DATES = [
        {
            date: '2014-03-06',
            text: '6 марта'
        },
        {
            date: '2014-03-31',
            text: '31 марта'
        },
        {
            date: '2014-04-30',
            text: '30 апреля'
        }
    ];
    return {
        scope: {},
        templateUrl: 'partials/stmIndex.directive:stmIndexSale:template.html',
        controller: ['$stmEnv', '$interval', '$scope', 'Subscribe', '$element', '$timeout', '$stmAuth', function($stmEnv, $interval, $scope, Subscribe, $element, $timeout, $stmAuth){
            var timerInterval = $interval(updateTimer, 1000, null, false);
            
            $scope.email = "";
            $scope.dates = DATES;
            var modelSubscribe = $scope.modelSubscribe = {};
            $scope.submitSubscribe = function(noShare){
                var form = modelSubscribe.form;
                var emailField = form.email;
                if(!form.isSend && form.$valid) {
                    form.isSend = true;
                    var res = Subscribe.save({
                        email: $scope.email
                    }, function(){
                        if(!res.success) {
                            return;
                        }
                        if(!noShare) showShare();
                        $scope.subscribeSuccess = true;
                    });
                    res.$promise.finally(function(){
                        form.isSend = false;
                    });
                }
            }            
            $scope.products = $stmEnv.products;
            $scope.closeSharePopup = function(){
                $scope.showSharePopup = false;
            }   
            
            $scope.clickProduct = function(e, item){
                if($stmAuth.isAuth || $scope.subscribeSuccess) return;
                e.preventDefault();
                $scope.subscribePopupProductUrl = item.url;
                $scope.showSubscribePopup = true;
            }
            $scope.closeSubscribePopup = function(){
                $scope.showSubscribePopup = false;
            }
            
            updateTimer();
            
            if(localStorage.getItem('_stmSochiShareSale')) $timeout(showShare, 1000);
            
            function showShare(){
                if($stmAuth.isAuth){
                    $scope.showSharePopup = true;
                    localStorage.removeItem('_stmSochiShareSale');
                    return;
                }
                $stmAuth.auth(function(){
                    localStorage.setItem('_stmSochiShareSale', true);
                    window.location.reload();
                });
            }
            function updateTimer(){

                var diffTime = Math.max(0, Math.round(($stmEnv.time - new Date().getTime()) / 1000));
                var dd = timePart(Math.floor(diffTime/86400));
                var hh = timePart(Math.floor((diffTime-dd*86400)/3600));
                var mm = timePart(Math.floor((diffTime-dd*86400-hh*3600)/60));
                var ss = timePart(diffTime-dd*86400-hh*3600-mm*60);
                $scope.timer = {
                    dd: dd,
                    hh: hh,
                    mm: mm,
                    ss: ss
                }
                updateDates($scope.dates, $scope);
                if(diffTime == 0) $interval.cancel(timerInterval);
            }
        }]       
    };
    function updateDates(dates, $scope){
        var time = new Date().getTime();
        var dateTime;
        var startTime = new Date(dates[0].date).getTime();
        var timeLength = new Date(dates[dates.length - 1].date).getTime() - startTime;
        for(var i=0;i<dates.length;i++){
            dateTime = new Date(dates[i].date).getTime();
            dates[i].css = {
                left: Math.round((dateTime - startTime) / timeLength * 912) + 'px'
            }
            dates[i].cls = (i == 0 ? 'mod_first' : i == dates.length-1 ? 'mod_last' : '') +' scheme_' + (dateTime < time ? 'blue' : 'red');
        }
        
        $scope.lineCss = {
            width: Math.round((time - startTime) / timeLength * 100) +'%'
        };
    }
    function timePart(value){
        var part = '' + value;
        return (part.length < 2 ? '0' : '') + part;
    }
})
    /**
     * @ngdoc interface
     * @name stmIndex.Subscribe
     * @description
     *
     * Внешний интерфейс подписки
     * 
     */
    /**
       * @ngdoc method
       * @name stmIndex.Subscribe#save
       * @methodOf stmIndex.Subscribe
       *
       * @description
       * Сохраняет данные о подписке
       *
       * @param {Object} params Данные подписки:
       *
       *   - **`email`** – {String} – Email подписчика
       */         
    .factory('Subscribe', ['$resource', function($resource){
        return $resource('api/subscribe.php');
    }]);
