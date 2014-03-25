"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexCode
 * @function
 *
 * @requires stmIndex.directive:stmIndexCode:b-code.css
 * @requires stmIndex.directive:stmIndexCode:template.html
 *
 * @requires stmIndex.stmCode
 * @requires stmIndex.$stmAchievs
 * @requires stmIndex.stmOtherAchiev
 * @requires stmIndex:b-other-achiev.css
 * @requires stmIndex.stmMapAchiev
 * @requires stmIndex.directive:stmIndexAchiev
 *
 * @description
 * Использование кодов
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-code></div>
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


angular.module('stmIndex').directive('stmIndexCode', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexCode:template.html',
        controller: ['$scope', 'stmCode', '$stmAchievs', 'stmMapAchiev', 'stmOtherAchiev', function($scope, stmCode, $stmAchievs, stmMapAchiev, stmOtherAchiev){
            var model = $scope.model = {};
            $scope.removeInvalidCode = function(){
                model.form.code.$setValidity('code', true);
            }
            $scope.close = function(){
                $scope.$emit('closeCode');
            }
            $scope.submit = function(){
                var form = model.form;
                var codeField = form.code;
                if(!$scope.isSend && form.$valid) {
                    $scope.isSend = true;
                    var res = stmCode.send(model.code.toUpperCase(), function(){
                        if(!res.success) {
                            codeField.$setValidity('code', false);
                            
                            $scope.error = res.error;
                            return;
                        }
                        var achievsData = res.data.achievs;
                        var achievs = [];
                        var achiev;
                        for(var i=0;i<achievsData.length;i++){
                            achiev = $stmAchievs.get(achievsData[i]) || stmMapAchiev.getByType(achievsData[i]) || stmOtherAchiev.getByType(achievsData[i]);
                            if(achiev) achievs.push(achiev);
                        }
                        $scope.codeData = {
                            achievs: achievs
                        };
                    });
                    res.$promise.finally(function(){
                        $scope.isSend = false;
                    });
                }
            }             
        }]
    };
});
