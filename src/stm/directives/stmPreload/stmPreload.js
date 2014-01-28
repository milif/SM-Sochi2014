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
         <div stm-preload class="example-screen"></div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 400px;
            position: relative;
            background: blue;
            }
      </file>
      <file name="index.js">
         window._assets = ['https://www.google.com/images/srpr/logo11w.png','https://www.google.com/images/srpr/logo11w.png'];
      </file>
    </example>
    
 */

angular.module('stm').directive('stmPreload', ['$compile', function($compile){    

    var $ = angular.element;
    var tpl = $compile('<div ng-class="state" class="b-preload"><div class="__loader"></div></div>');
    
    return {
        priority: 99,
        controller: ['$element', '$scope', '$window', '$animate', '$timeout', function($element, $scope, $window, $animate, $timeout){
            var maskEl;
            var isLoad = false;
            $timeout(function(){
                if(!isLoad) $scope.state = "state_loading";
            }, 500);
            tpl($scope, function(el){
                $element.append(el);
                maskEl = el;
                $element
                    .data('_overflow', $element.css('overflow'))
                    .css('overflow','hidden')
                    .scrollTop(0);                
                preload($window._assets);
            });
            function preload(assets){
                var item;
                var count = 0;
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
                        isLoad = true;
                        $scope.$apply(function(){
                            $animate.leave(maskEl);
                            $element
                                .css('overflow', $element.data('_overflow'));
                        });                            
                    }
                }
            }
        }]
    };
}]);
