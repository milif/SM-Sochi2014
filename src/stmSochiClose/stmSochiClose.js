"use strict";
/**
 * 
 * @ngdoc overview
 * @name stmSochiClose
 * @description
 *
 * @requires jquery/jquery.js
 * @requires angular/angular.js
 * @requires angular/angular-animate.js
 *
 * @requires stm
 * @requires stmSochiClose:style.css
 *
 * Модуль закрытия распродажи
 */

angular.module('stmSochiClose', ['stm'])
        .controller('closePage', ['$scope', '$http', function($scope, $http){
            var $ = angular.element;
            var model = $scope.model = {};
            $scope.isSend = false;
            $scope.state = 'send';
            $scope.submit = function(){
                var form = model.form;
                if(!$scope.isSend && form.$valid) {
                    $scope.isSend = true;
                    var email = model.email;
                    
                    var res = $http.post('/ajx/subscribe.php', $.param({JSON_STR: JSON.stringify({
                        type: 'promo',
                        data: [{type: 'email', value: email}]
                    })}), {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    res.success(function(data){
                        if(data.errcode == 0){
                            $scope.state = 'sended';
                        } else {
                            form.email.$setValidity('required', false);
                        }
                    });
                    res.finally(function(){
                        $scope.isSend = false;
                    });
                }
            }  
        }]);

