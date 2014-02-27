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
            date: '2014-02-06',
            text: '6 февраля'
        },
        {
            date: '2014-02-14',
            text: '14 февраля'
        },
        {
            date: '2014-02-23',
            text: '23 февраля'
        },
        {
            date: '2014-03-21',
            text: '21 марта'
        },
        {
            date: '2014-02-31',
            text: '31 марта'
        }
    ];
    return {
        scope: {},
        templateUrl: 'partials/stmIndex.directive:stmIndexSale:template.html',
        controller: ['$stmEnv', '$interval', '$scope', 'Subscribe', '$element', function($stmEnv, $interval, $scope, Subscribe, $element){
            var timerInterval = $interval(updateTimer, 1000, null, false);
            
            $scope.email = "";
            $scope.dates = DATES;
            $scope.submitSubscribe = function(){
                var form = $scope.subscribeForm;
                var emailField = form.email;
                if(!form.isSend && form.$valid) {
                    form.isSend = true;
                    var res = Subscribe.save({
                        email: $scope.email
                    }, function(){
                        if(!res.success) {
                            return;
                        }
                        $scope.subscribeSuccess = true;
                    });
                    res.$promise.finally(function(){
                        form.isSend = false;
                    });
                }
            }            
            $scope.products = $stmEnv.products;
            
            updateTimer();
            
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
                updateDates($scope.dates);
                if(diffTime == 0) $interval.cancel(timerInterval);
            }
        }]       
    };
    function updateDates(dates){
        var time = new Date().getTime();
        var dateTime;
        for(var i=0;i<dates.length;i++){
            dateTime = new Date(dates[i].date).getTime();
            dates[i].cls = 'mod_' + (i+1) +' scheme_' + (dateTime < time ? 'blue' : 'red');
        }
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
