"use strict";
    /**
     * @ngdoc interface
     * @name stmIndex.stmCode
     * @description
     *
     * Внешний интерфейс кодов
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.stmCode#send
       * @methodOf stmIndex.stmCode
       *
       * @description
       * Запрос на использование кода
       *            
       */         
    angular.module('stmIndex').factory('stmCode', ['$resource', function($resource){
    
        var stmCode = $resource('api/code.php');
        
        stmCode.send = send;
        
        return stmCode;
        
        function send(code, clbFn){
            return stmCode.save({
                'code': code
            }, clbFn);
        }
    }]) 
