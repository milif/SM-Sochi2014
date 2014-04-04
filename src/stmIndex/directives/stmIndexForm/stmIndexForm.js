"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexForm
 * @function
 *
 * @requires stmIndex.directive:stmIndexForm:b-form.css
 * @requires stmIndex.directive:stmIndexForm:template.html
 * @requires stmIndex.directive:stmIndexForm:field.html
 *
 * @description
 * 
 * Формы
 *
 * @param {Object} stmIndexForm Конфигурация формы
 * 
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="controller">
            <div stm-index-form="formCfg"></div>
        </div>
      </file>
      <file name="controller.js">
        function controller($scope){
            $scope.formCfg = {
                fields: [
                    {
                        type: 'text',
                        label: 'Фамилия, Имя и Отчество',
                        placeholder: 'Ф.И.О.',
                        name: 'name',
                        required: true,
                        validator: /^\w+\s+[\w\s]+/
                    },
                    {
                        type: 'email',
                        label: 'Электронная почта',
                        name: 'email',
                        required: true
                    },
                    {
                        type: 'phone',
                        label: 'Номер телефона',
                        name: 'phone',
                        required: true
                    },
                    [
                        {
                            type: 'date',
                            label: 'Дата рождения',
                            name: 'dateofbirth',
                            required: true
                        },
                        {
                            type: 'switch',
                            label: 'Пол',
                            name: 'sex',
                            required: true,
                            values: [['Мужской', 'male'], ['Женский', 'female']]
                        }                        
                    ]
                ]
            }
        }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexForm', function(){

    var COUNTRIES = [
        {
            code: 'ru',
            name: 'Россия и Казахстан',
            mask: '+7(999) 999-99-99',
            prefix: '+7'
        },
        {
            code: 'ua',
            name: 'Украина',
            mask: '+380(99) 999-99-99',
            prefix: '+380'
        },
        {
            code: 'by',
            name: 'Беларусь',
            mask: '+375(99) 999-99-99',
            prefix: '+375'
        }
    ]; 
    
    var $$ = angular;
     
    return {
        scope: true,
        replace: true,
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexForm:template.html',
        controller: ['$scope', '$attrs', function($scope, $attrs){
            var formCfg;
            var form;
            var fields = [];
            var model;
            $scope.countries = COUNTRIES;
            $scope.isArray = angular.isArray; 
            
            $attrs.$observe('stmIndexForm', function(cfg){
                formCfg = $$.extend($scope.$eval(cfg), {
                    validate: validate
                });
                formCfg[$attrs.model] = form = $scope.form;
                $scope.fields = formCfg.fields;
                model = $scope.model = formCfg.model;
                
                addFields($scope.fields);
                
                var field;
                for(var i=0;i<fields.length;i++){
                    field = fields[i];
                    if(field.type == 'phone') {
                        setCountry(field);
                    }
                }
            });
            
            function validate(){
                $scope.isValidate = true;
                return form.$valid;
            }
            function setCountry(field){
                if(field.country) return;
                var phone = model[field.name] || "";
                var country;
                for(var i=0;i<COUNTRIES.length;i++){
                    if(phone.indexOf(COUNTRIES[i].prefix) === 0) {
                        phone = phone.replace(COUNTRIES[i].prefix, '');
                        country = COUNTRIES[i];
                        break;
                    }
                }
                field.country = country = country || COUNTRIES[0];
                model[field.name] = phone;
                model[field.name+'_country'] = country.prefix;
            }
            function addFields(flds){
                for(var i=0;i<flds.length;i++){
                    if($$.isObject(flds[i])) {
                        fields.push(flds[i]);
                    } else if($$.isArray(flds[i])){
                        addFields(flds[i]);
                    }
                }            
            }
        }]
    }
})
.directive('stmIndexFormField', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexForm:field.html',
        controller: ['$attrs', '$scope', '$timeout', function($attrs, $scope, $timeout){
            var field;
            $scope.onBlurMask = function(e){
                var modelCtrl = $(e.target).data('$ngModelController');
                if(!field.required) setTimeout(function(){
                    if(modelCtrl.$viewValue != '') return;
                    $scope.$apply(function(){
                         modelCtrl.$setValidity('required', true);
                    });                   
                }, 0);                
            };
            $attrs.$observe('stmIndexFormField', function(value){
                field = $scope.field = $scope.$eval(value);
                if($scope.field.type == 'date') $timeout(function(){
                    $scope.$parent[$scope.field.name] = "";
                }, 0);
            });
        }]
    };
})
.directive('date', ['$filter', function ($filter){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {

          //For DOM -> model validation
          ngModel.$parsers.unshift(function(value) {
             var valid = isValid(value);
             ngModel.$setValidity('date', !!valid);
             return value;
          });

          //For model -> DOM validation
          ngModel.$formatters.unshift(function(value) {
             ngModel.$setValidity('date', !!isValid(value));
             return value;
          });
      }
   };
   function isValid(value){
      if(!value) return true;
      var date = value.replace(/[^\d]/g,'');
      
      if(date.length != 8) return false;

      date = new Date(date.substring(4)+'-'+date.substring(2,4)+'-'+date.substring(0,2));
      var time = date.getTime();
      var curTime = new Date().getTime();
      var valid = !(isNaN(time) || (curTime - time < 86400 * 365 * 4 * 1000) || (curTime - time > 86400 * 365 * 90 * 1000));
      return valid ? time : false;
   }
}]);
