"use strict";
/**
 * @ngdoc service
 * @name stmIndex.$stmCheck18
 *
 * @requires stmIndex.$stmCheck18:template.html
 * @requires stmIndex.$stmCheck18:b-confirm18.css
 * @requires stmIndex.directive:stmIndexPopup
 * 
 * @description
 *
 * Подтверждение возраста.
 *
 *  
 */

angular.module('stmIndex').factory('$stmCheck18', [ '$http', '$rootScope', '$compile', '$timeout', function($http, $rootScope, $compile, $timeout){

    var $ = angular.element;

    var tplName = 'partials/stmIndex.$stmCheck18:template.html';
    var tpl;
    var $scope;

    return $stmSocial;
    
    function $stmSocial(clbFn, cntEl){
        if(localStorage.getItem('_stmSochiIsConfirm18')) {
            clbFn();
            return;
        }
        if(!tpl) {
            $http.get(tplName).success(function(html){
                tpl = $compile(html);
                showPopup(cntEl, clbFn);
            });
            return;
        }
        showPopup(cntEl, clbFn);    
    }
    function showPopup(cntEl, clbFn){
        if(!$scope) {
            $scope = $rootScope.$new();
            $scope.closePopup = function(){
                $scope.showPopup = false;
            }
            $scope.yes = function(){
                $scope.showPopup = false;
                localStorage.setItem('_stmSochiIsConfirm18', 1);
                clbFn();
            }
            
            tpl($scope, function(el){
                cntEl.append(el);
            });         
        } 
        $scope.showPopup = true;   
    }
}]);
