"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopup:b-popup.css
 * @requires stmIndex.directive:stmIndexPopup:template.html
 *
 * @requires stmIndex.directive:stmIndexSocial
 *
 * @description
 * Popup
 *
 * @element ANY
 *
 * @param {String=} header Шаблон заголовка
 * @param {String=} contentAfter Шаблон блока после контента
 * @param {Boolean=} closable Закрываемый
 * @param {Boolean=} footer Наличие футера
 * @param {Boolean=} show Видимость
 * @param {Boolean=} fixed Позицирование
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div ng-controller="Controller">
            <div stm-index-popup class="example-popup">
                <div class='b-popup-title'>
                  Альпинист — восхождение по канату<br>на самую высокую гору мира
                </div>
                <div class='b-popup-note'>
                  Для движения наверх нажимай стрелку <b><i>Вверх.</i></b><br>Уклоняйся от падающих сосулек и собирай бонусы<br>от спонсора игры — «Сбербанка»
                </div>       
            </div>            
            <div stm-index-popup game-data="game" class="example-popup"></div>
            <div stm-index-popup game-data="gameNoDetails" class="example-popup"></div>

            <div stm-index-popup class="example-popup">
                <div class='b-popup-title'>
                    Альпинист — восхождение по канату<br>на самую высокую гору мира
                </div>
                <div class='b-popup-attent g-clearfix'>
                    <div class="b-button b-button_size_normal b-button_scheme_red2 mod_fl-position">
                        <div class="b-button__text">Подтвердить</div>
                        <a class="b-button__link" href="#sale"></a>
                    </div>
                    <div class='b-popup-attent__text'>
                        Ваша электронная почта не подтверждена. Это важно.
                    </div>
                </div
            </div>


        </div>
      </file>
      <file name="style.css">
         .example-popup {
            width: 100%;
            height: 600px;
            position: relative;
            overflow: auto;
            padding: 20px;
            box-sizing: border-box;
            }
      </file>
      <file name="controller.js">
         function Controller($scope){
            $scope.info = {
                keys: [
                    {}
                ]
            };
            $scope.game = {
                type: 'biathlon',
                score: 1200,
                best: {
                    score: 1000,
                    items: [
                        {
                            type: 'mnogo',
                            score: 300
                        },
                        {
                            type: 'sber',
                            score: 400
                        },
                        {
                            type: 'pickpoint',
                            score: 1300
                        }
                    ]
                },
                achievements: [
                    {
                        type: 'lasthero',
                        text: 'Последний герой',
                        active: true
                    },
                    {
                        type: 'starshooter',
                        text: 'Звездный стрелок',
                        active: true           
                    },             
                    {
                        type: 'journalist',
                        text: 'Журналист'            
                    }                   
                ]
                
            };
            $scope.gameNoDetails = {
                type: 'biathlon',
                score: 1000,
                best: {
                    score: 1200                    
                },
                achievements: [
                    {
                        type: 'lasthero',
                        text: 'Последний герой',
                        active: true
                    },
                    {
                        type: 'starshooter',
                        text: 'Звездный стрелок',
                        active: true           
                    },             
                    {
                        type: 'journalist',
                        text: 'Журналист'            
                    }                   
                ]
                
            };
         }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexPopup', function(){
    var $ = angular.element;
    return {
        scope: true,
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexPopup:template.html',
        controller: ['$scope', '$attrs', '$element', '$timeout', function($scope, $attrs, $element, $timeout){
            var cntEl = $element.parent();         
            
            var closeEvents = {
                'keydown': function(e){
                    if(e.which != 27 || !$scope.show) return;
                    e.stopPropagation();
                    $scope.$apply(function(){
                        $scope.close();
                    });
                }
            }
            
            $attrs.$observe('show', function(show){
                $scope.show = 'show' in $attrs ? $scope.$eval(show) : false;
                if(!('show' in $attrs)){
                    $timeout(function(){
                        $scope.show = true;
                    }, 30);
                }
            });
            $scope.$on('closePopup-' + $attrs.stmIndexPopup, function(){
                $scope.close();
            });
            $scope.contentAfter = $attrs.contentAfter ? $scope.$eval($attrs.contentAfter) || $attrs.contentAfter: false;
            $scope.header = $attrs.header ? $scope.$eval($attrs.header) || $attrs.header: false;
            $scope.isFixed = $attrs.fixed ? $scope.$eval($attrs.fixed) : false;
            $scope.hasFooter = $attrs.footer ? $scope.$eval($attrs.footer) : true;
            $scope.hasMap = $attrs.gomap ? $scope.$eval($attrs.gomap) : true;
            $scope.hasClose = !!($attrs.closable ? $scope.$eval($attrs.closable) : false);
            $scope.hasMask = !!($attrs.mask ? $scope.$eval($attrs.mask) : false);
            var popupCss = $scope.popupCss = {};
            if($attrs.width){
                popupCss.minWidth = popupCss.width = $scope.$eval($attrs.width);
            }
            if($attrs.minWidth){
                popupCss.minWidth = $scope.$eval($attrs.minWidth);
            }
            
            if($scope.hasClose) {
                $element.on('click', function(e){
                    if($(e.target).closest('.b-popup').length > 0) return;
                    $scope.$apply(function(){
                        $scope.close();
                    });
                });
            }
            $scope.$watch('show', function(show){
                if(show && $scope.hasClose) {
                    $(document).on(closeEvents);
                } else {
                    $(document).off(closeEvents);
                }
                if(show) {
                    if(cntEl.get(0).clientHeight < cntEl.get(0).scrollHeight) 
                        cntEl
                            .addClass('view_popup')
                            .css({
                                overflow: 'hidden',
                                marginRight: 15
                            });
                } else {
                    $timeout(function(){
                        if($scope.show) return;
                        var visibleEls = cntEl.find('> [stm-index-popup] > *:visible');
                        if(visibleEls.length == 0 || (visibleEls.length == 1 && visibleEls.closest($element).length == 1)) {
                            cntEl
                                .removeClass('view_popup')
                                .css({
                                    overflow: 'visible',
                                    marginRight: 0
                                });
                        }
                        if($scope[$attrs.closable]) $scope[$attrs.closable]();
                    }, 200);
                }              
            });

            $scope.close = function(){
                $scope.$emit('popupClose');
                $scope.show = false;
            }
        }]
    };
});
