"use strict";
/**
 * @ngdoc directive
 * @name stm.directive:stmPreload
 * @function
 *
 * @requires stm.directive:stmPreload:b-preload.css
 *
 * @description
 * Загрузчик картинок. По умолчанию данные к загрузке берутся из window._assets
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-preload="{{assets}}" class="example-screen" ng-controller="preload">
            <div ng-click="load()" class="btn">Load</div>
         </div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 400px;
            position: relative;
            }
         .example-screen .b-preload {
            background: #ffd531;
            }
      </file>
      <file name="index.js">
         function preload($scope, $timeout){
            $scope.load = function(){
                $scope.assets = 'window._assets';
                $timeout(function(){
                    $scope.assets = '';
                }, 30);
            }
         }
         window._assets = ['https://www.google.com/images/srpr/logo11w.png','https://www.google.com/images/srpr/logo11w.png'];
      </file>
    </example>
    
 */

angular.module('stm').directive('stmPreload', ['$compile', function($compile){    

    var $ = angular.element;
    var tpl = $compile('<div ng-class="state" class="b-preload g-font"><div class="__loader"></div><div ng-if="showPercent" class="__percent">{{percent}}%</div></div>');
    
    return {
        scope: true,
        priority: 99,
        controller: ['$element', '$scope', '$window', '$animate', '$timeout', '$attrs', function($element, $scope, $window, $animate, $timeout, $attrs){
            var maskEl;
            var isLoad = true;
            var assets;
            var count;
            
            $scope.window = window;
            $scope.showPercent = false;
            $attrs.$observe('stmPreload', function(attr){
                assets = $scope.$eval(attr) || window._assets;
                if(!assets || !isLoad) return;
                isLoad = false;
                $timeout(function(){
                    if(!isLoad) $scope.state = "state_loading";
                }, 500);
                $timeout(function(){
                    if(!isLoad) $scope.showPercent = true;
                }, 1000);
                tpl($scope, function(el){
                    $element.append(el);
                    maskEl = el;
                    $element
                        .data('_overflow', $element.css('overflow'))
                        .data('_overflowY', $element.css('overflow-y'))
                        .css('overflow','hidden'); 
                    setTimeout(function(){
                        $element.scrollTop(0);
                    }, 50);            
                    preload();
                });
            });            
            function preload(){
                var item;
                count = 0;
                for(var i=0;i<assets.length;i++){
                    item = assets[i];
                    if(/\.(png|jpg|gif)\s*$/i.test(item)){
                        count++;
                        $(new Image()).attr('src', item)
                            .load(onload)
                            .error(onload);
                       
                    }
                }
                function onload(){
                    if(count-- == 1) {
                        $scope.percent = 100;
                        isLoad = true;
                        $scope.$apply(function(){
                            $animate.leave(maskEl);
                            $element
                                .css('overflow', $element.data('_overflow'))
                                .css('overflow-y', $element.data('_overflowY'));
                        /**
                           * @ngdoc event
                           * @name stm.directive:stmPreload#loaded
                           * @eventOf stm.directive:stmPreload
                           * @eventType emit on parent scope
                           * @description
                           * Окончание загрузки 
                           * 
                           */                                
                            $scope.$emit('loaded');
                        });                            
                    } else {    
                        $scope.percent = Math.round((assets.length - count) / assets.length * 100);
                        $scope.$digest();                        
                    }
                }
            }
        }]
    };
}]);
