"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexMnogoForm
 * @function
 *
 * @requires stmIndex.directive:stmIndexMnogoForm:b-mnogo.css
 * @requires stmIndex.directive:stmIndexMnogoForm:template.html
 *
 * @description
 * Форма карты Много.ру
 *
 * @element ANY
 *    
 */

angular.module('stmIndex').directive('stmIndexMnogoForm', function(){
    return {
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexMnogoForm:template.html',
        replace: true,
        controller: ['$scope', '$attrs', 'Mnogo', function($scope, $attrs, Mnogo){
            $scope.submitMnogo = function(){
                var form = $scope.mnogoForm;
                var codeField = form.code;
                if(!$scope.mnogoIsSend && form.$valid) {
                    $scope.mnogoIsSend = true;
                    var res = Mnogo.save({
                        code: $scope.mnogo
                    }, function(){
                        if(!res.success) {
                            codeField.$setValidity('mask', false);
                            form.error = 'error_' + res.error;
                            return;
                        }
                        $scope.mnogoSuccess = true;
                    });
                    res.$promise.finally(function(){
                        $scope.mnogoIsSend = false;
                    });
                }
            }                     
        }]
    };
})
    /**
     * @ngdoc interface
     * @name stmIndex.Mnogo
     * @description
     *
     * Внешний интерфейс карты Много.ру
     * 
     */
    /**
       * @ngdoc method
       * @name stmIndex.Mnogo#save
       * @methodOf stmIndex.Mnogo
       *
       * @description
       * Сохраняет данные о карте
       *
       * @param {Object} params Данные игры:
       *
       *   - **`code`** – {String} – Номер карты
       */         
    .factory('Mnogo', ['$resource', function($resource){
        return $resource('api/mnogo.php');
    }]);
