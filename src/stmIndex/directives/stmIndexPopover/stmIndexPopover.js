"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopover
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopover:b-popover.css
 * @requires stmIndex.directive:stmIndexPopover:template.html
 *
 * @description
 * Popover implementation
 *
 * @element ANY
 * @param {String=} stmIndexPopover component id 
 * @param {Array=} position set position [x, y]
 * @param {Array=} offset set offset [dx, dy]
 * @param {Integer=} hideEventTimeout Время до завершения закрытия
 * @param {Boolean=} hideOnClickout Закрытие по клику в сторону
 * @param {Boolean=} tooltip Компонент является тултипом
 * @param {Boolean=} element Селектор элеметов на которые вешается тултип
 * @param {String=} popoverType Тип показа (bottom|top|default)
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="popoverCtrl" class="b-sample">
            <div class="btn" ng-click="show()">Show</div>
            <div ng-repeat="popup in popups" stm-index-popover="{{popup.id}}" position="popup.position">
                <div stm-index-bonus-popup bonus="bonus" type="sber"></div>
            </div>
        </div>
        
      </file>
      <file name="style.css">
      .b-sample {
          position:relative;
          height: 400px;
      }
      </file>
      <file name="controller.js">
        function popoverCtrl($scope, $timeout){
            var popups = $scope.popups = [];
            $scope.show = function(){
                $scope.bonus = Math.round(Math.random() * 200) * 10;
                var popup = {
                    id: new Date().getTime(),
                    position: [50 + Math.random() * 100, 50 + Math.random() * 100],
                    bonus: $scope.bonus
                }
                popups.push(popup);
                $timeout(function(){
                    $scope.$broadcast('hidePopover-' + popup.id);
                }, 3000);
            }
            
            // Подчищаем скрытые попапы
            $scope.$on('hidePopoverSuccess', function(e, id){
                for(var i=0; i<popups.length;i++){
                    if(popups[i].id == id){
                        popups.splice(i,1);
                        break;
                    }
                }
            });
        }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexPopover', function(){
    return {
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexPopover:template.html',
        transclude: true,
        replace: true,
        controller: ['$scope', '$attrs', '$timeout', '$element', '$window', function($scope, $attrs, $timeout, $element, $window){         

            var isTooltip = $attrs.tooltip ? $scope.$eval($attrs.tooltip) : false;
        
            var autoOpen = !$attrs.show && !isTooltip;
            var windowEl = $($window);
            
            var globalEvents = {
                'mousedown': function(e){
                    if($(e.target).closest($element).length == 0){
                        hide();
                    }
                }
            }
            
            if(isTooltip){
                $element.parent().on('mousedown', $attrs.element, function(e){
                    $scope.$apply(function(){
                        showTooltip(e);
                    });
                });
            }
            
            if(autoOpen){
                $scope.hide = true;
                $timeout(function(){
                    $scope.$apply(show);                
                }, 30);
            }
            
            var hideTimeout = $attrs.hideEventTimeout ? $scope.$eval($attrs.hideEventTimeout) : ( isTooltip ? 0 : 500);
            var isHideOnClickout = $attrs.hideOnClickout ? $scope.$eval($attrs.hideOnClickout) : isTooltip;
            var offset = $attrs.offset ? $scope.$eval($attrs.offset) : [0,0];
            var position;
            
            $attrs.$observe('popoverType', function(type){
                $scope.type = $scope.$eval(type) || $attrs.popoverType; 
                if(position) updatePosition();              
            });
            
            
            $attrs.$observe('stmIndexPopover', function(id){
                $scope.id = $scope.$eval(id) || $attrs.stmIndexPopover;
            /**
               * @ngdoc event
               * @name stmIndex.directive:stmIndexPopover#hidePopover-ID
               * @eventOf stmIndex.directive:stmIndexPopover
               * @eventType local on scope
               * @description
               * Инициирует скрытие компонента 
               * 
               */                
                $scope.$on('hidePopover-' + $scope.id, hide);                
            });
            $attrs.$observe('position', function(pos){
                if(!$attrs.position) return;
                position = $scope.$eval(pos);
                updatePosition();
            });                   
            $attrs.$observe('show', function(showAttr){
                if(!$attrs.show) {
                    $scope.hide = true;
                    return;
                }
                if($scope.$eval(showAttr)) show();
                else hide();
            });
            function showTooltip(e){
                var el = $(e.target);
                var offset = el.offset();
                var windowEl = $(window);
                  
                var offsetParentEl;
                if($element.is('.ng-hide')){
                    $element.removeClass('ng-hide');
                    offsetParentEl = $element.offsetParent();
                    $element.addClass('ng-hide')
                } else {
                    offsetParentEl = $element.offsetParent();
                }
                var cntOffset = offsetParentEl.offset();
                var isTop = offset.top > windowEl.height() - offset.top - el.outerHeight();
                $scope.type = isTop ? 'top' : 'bottom';
                if(isTop){
                    position = [-cntOffset.left + offset.left, -cntOffset.top + offsetParentEl.outerHeight() - offset.top];
                } else {
                    position = [-cntOffset.left + offset.left, -cntOffset.top + offset.top + el.outerHeight()];
                }
                updatePosition();               
                show();            
            }
            function show(){
                if(!$scope.hide) return;
                $scope.hide = false;
                if(isHideOnClickout) {
                    $timeout(function(){
                        windowEl.on(globalEvents);
                    }, 50);
                }
            }
            function hide(){
                if($scope.hide) return;
                windowEl.off(globalEvents);
                $scope.hide = true;
                $timeout(function(){
                 /**
                   * @ngdoc event
                   * @name stmIndex.directive:stmIndexPopover#hidePopoverSuccess
                   * @eventOf stmIndex.directive:stmIndexPopover
                   * @eventType emit on parent scope
                   * @description
                   * Сообщает о завершении скрытия 
                   * 
                   * @param {String} id Id .
                   */                    
                    $scope.$emit('hidePopoverSuccess', $scope.id);
                }, hideTimeout);
            }
            function updatePosition(){
                if(!position) return;
                if($scope.type == 'top'){
                    $scope.css = {
                        left: position[0] + offset[0],
                        bottom: position[1] + offset[1]
                    }                
                } else {
                    $scope.css = {
                        left: position[0] + offset[0],
                        top: position[1] + offset[1]
                    }
                }                
            }
        }]
    };
});
