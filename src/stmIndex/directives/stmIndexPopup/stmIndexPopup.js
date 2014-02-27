/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopup:b-popup.css
 * @requires stmIndex.directive:stmIndexPopup:template.html
 *
 * @requires stmIndex.directive:stmIndexSocial
 * @requires stmIndex.directive:stmIndexAchiev
 *
 * @description
 * Popup
 *
 * @element ANY
 *
 * @param {Expression=} game-data Данные о прохождении игры
 * @param {Boolean=} closable Закрываемый
 * @param {Boolean=} footer Наличие футера
 * @param {Boolean=} show Видимость
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
            <div stm-index-popup footer="false" closable="true" class="example-popup">
                <div class="b-popup-title">
                    Собирайте бонусы от спонсоров
                </div>

                <div stm-index-popup-tabs class="l-popup-tabs">
                    <div class="b-popup-tabs">
                        <div class="b-popup-tabs_item">
                            <div class="b-slide-result-item mod_mnogo">
                                <div class="b-slide-result-icon"></div>
                                <div class="b-slide-result-text">100</div>
                            </div> 
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-slide-result-item mod_sber">
                                <div class="b-slide-result-icon"></div>
                                <div class="b-slide-result-text">100</div>
                            </div> 
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-slide-result-item mod_pickpoint">
                                <div class="b-slide-result-icon"></div>
                                <div class="b-slide-result-text">100</div>
                            </div> 
                        </div>
                        
                    </div>
                    <div class="b-popup-tab-content">
                        Соберите 10, и получите 10 баллов Много.ру на свою карту
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете получить ускорение метко попадая в цели
                    </div>
                    <div class="b-popup-tab-content">
                        Соберите 10, и получите 10 баллов Много.ру на свою карту
                    </div>
                </div>


                <div class="b-popup-title">
                    Получайте достижения
                </div>
                
                <div stm-index-popup-tabs class="l-popup-tabs">
                    <div class="b-popup-tabs">
                        <div class="b-popup-tabs_item">
                             <div class="b-achive-item mod_tabs">
                                 <div class="b-achive">
                                     <div tab-active class="b-achive__h achiv_climber_journalist">
                                     </div>
                                 </div>
                                 <div class="b-achive-item-note">Оленевод</div>
                             </div>
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-achive-item mod_tabs">
                                 <div class="b-achive">
                                     <div tab-active class="b-achive__h achiv_climber_pioneer">
                                     </div>
                                 </div>
                                 <div class="b-achive-item-note">Оленевод</div>
                             </div>
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-achive-item mod_tabs">
                                 <div class="b-achive">
                                     <div tab-active class="b-achive__h achiv_climber_amateurfauna">
                                     </div>
                                 </div>
                                 <div class="b-achive-item-note">Оленевод</div>
                             </div>
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-achive-item mod_tabs">
                                 <div class="b-achive">
                                     <div tab-active class="b-achive__h achiv_yeti_amongstrangers">
                                     </div>
                                 </div>
                                 <div class="b-achive-item-note">Оленевод</div>
                             </div>
                        </div>
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете получить ускорение метко попадая в цели
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете получить ускорение метко попадая в цели
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете получить ускорение метко попадая в цели
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете получить ускорение метко попадая в цели
                    </div>
                </div>  
            </div>          
            <div stm-index-popup  class="example-popup">
                <div class='b-popup-title'>
                  Биатлон — не дай себя догнать Йети
                </div> 
                <div stm-index-popup-tabs class="l-popup-tabs">
                    <div class="b-popup-tabs">
                        <div class="b-popup-tabs_item">
                            <div class="b-popup-tabs_item-decor mod_1"></div>
                            <div class="b-popup-tabs_item-text">Ускорение</div>
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-popup-tabs_item-decor mod_2"></div>
                            <div class="b-popup-tabs_item-text">Прыжок</div>
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-popup-tabs_item-decor mod_3"></div>
                            <div class="b-popup-tabs_item-text">Присесть</div>
                        </div>
                        <div class="b-popup-tabs_item">
                            <div class="b-popup-tabs_item-decor mod_4"></div>
                            <div class="b-popup-tabs_item-text">Выстрел</div>
                        </div>
                    </div>
                    <div class="b-popup-tab-content">
                        Чтобы набрать скорость используйте ускорение
                    </div>
                    <div class="b-popup-tab-content">
                        Прыгайте чтобы дотянуться до бонусов
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете присесть на склоне, чтобы набрать скорость
                    </div>
                    <div class="b-popup-tab-content">
                        Вы можете получить ускорение метко попадая в цели
                    </div>
                </div>
                
                <div class="b-popup-link-bonus">
                    <span class="b-popup-link-bonus-h">Бонусы и трофеи</span>
                </div>                       
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
        controller: ['$scope', '$attrs', 'Mnogo', '$element', function($scope, $attrs, Mnogo, $element){
        
            $attrs.$observe('show', function(show){
                $scope.show = 'show' in $attrs ? $scope.$eval(show) : true;
                if($scope.show && $scope.hasClose) {
                    $(document).on(closeEvents);
                } else {
                    $(document).off(closeEvents);
                }
            });
            
            var closeEvents = {
                'keydown': function(e){
                    if(e.which != 27 || !$scope.show) return;
                    e.stopPropagation();
                    $scope.$apply(function(){
                        $scope.close();
                    });
                }
            }
        
            $scope.$watch($attrs.gameData, function(){
                $scope._gameData = $scope[$attrs.gameData];
            });
            $scope.hasFooter = $attrs.footer ? $scope.$eval($attrs.footer) : true;
            $scope.hasClose = !!($attrs.closable ? $scope.$eval($attrs.closable) : false);
            
            if($scope.hasClose) {
                $element.on('click', function(e){
                    if($(e.target).closest('.b-popup').length > 0) return;
                    $scope.$apply(function(){
                        $scope.close();
                    });
                });
            }
            
            $scope.play = function(){
                $scope.$emit('popupPlay');
            }
            $scope.close = function(){
                if($scope[$attrs.closable]) $scope[$attrs.closable]();
                $scope.$emit('popupClose');
            }
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
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopupBonusInfo
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopupBonusInfo:bonusinfo.html
 * @requires stmIndex.directive:stmIndexPopup
 * @requires stmIndex.directive:stmIndexTabs
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="example-info">
            <div stm-index-popup-bonus-info></div>
        </div>
      </file>
      <file name="style.css">
         .example-info {
            background: white;
            padding: 20px;
            text-align: center;
            }
      </file>      
    </example>
 * 
 */
.directive('stmIndexPopupBonusInfo', [function(){
    return {
        replace: true,
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexPopupBonusInfo:bonusinfo.html'
    };
}])
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
