"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexTooltip
 * @function
 *
 * @requires stmIndex.directive:stmIndexTooltip:b-tooltip.css
 * @requires stmIndex.directive:stmIndexTooltip:template.html
 * 
 * @description
 * Tooltip
 *
 * @element ANY
 * @param {String} position Позиция (top_left|bottom_left)
 * @param {Boolean} closable Закрываемый
 * @example
    <example module="appExample">
      <file name="index.html">
         <br>
         <div stm-index-tooltip style="width: 200px;">Псс, парень, попить хочешь?</div>
         <br>
         <div stm-index-tooltip>
            <div class="b-tooltip-lock">
                Нужно <a href="#">войти</a>, чтобы сохранять игровые достижения
            </div>         
         </div>
         <br/>
         <div stm-index-tooltip position="bottom_left" closable="true" style="width: 293px;">
            <div class="b-tooltip__quiz">
                <div class="b-map__quiz-img"></div>
                <div class="b-map__quiz-title">
                    Да, это ещё один! 
                </div>
                <div class="b-map__quiz-note">
                    Осталось: 15/<i>24</i> &nbsp;&nbsp; Осталось времени: 01:21:<i>03</i>
                </div>
            </div>                 
         </div>         
         <br>
         <div stm-index-tooltip class="mod_beta">
            <p>Мы произвели тестовый запуск Сочных Игр. Все игроки могут начать тренировки, и подойти подготовленно к официальному запуску.</p>
            <p>Если в процессе Игр у вас появились идеи по улучшению, или вы обнаружили ошибки, пожалуйста, сообщите нам:<br />
                <a href="mailto:razvitie@sotmarket.ru">razvitie@sotmarket.ru</a></p>
            <p><span class="b-maptooltip-info">Самые активные получат сюрприз<br />от Сотмаркета</span></p>
            <p>И самое главное:<br><span class="__info">Все достижения сохранятся!</span></p>
         </div>
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexTooltip', function(){  
    return {
        scope: true,
        replace: true,
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexTooltip:template.html',
        controller:['$attrs', '$scope', function($attrs, $scope){
            $scope.close = $attrs.closable ? $scope.$eval($attrs.closable) : false;
            $scope.isClosable = !!$scope.close;
            $attrs.$observe('position', function(position){
                $scope._position = position || 'top_left';
            }); 
        }]
    };
});

