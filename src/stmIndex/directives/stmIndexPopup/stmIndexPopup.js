/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexPopup
 * @function
 *
 * @requires stmIndex.directive:stmIndexPopup:b-popup.css
 * @requires stmIndex.directive:stmIndexPopup:template.html
 *
 * @description
 * Popup
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div stm-index-popup class="example-popup">
            <div class='b-popup-title'>
              Альпинист — восхождение по канату<br>на самую высокую гору мира
            </div>
            <div class='b-popup-note'>
              Для движения наверх нажимай стрелку <b><i>Вверх.</i></b><br>Уклоняйся от падающих сосулек и собирай бонусы<br>от спонсора игры — «Сбербанка»
            </div>
            <div class='b-popup-button'>
              <div class='b-button button_size_big b-button_scheme_yellow'>
                <div class='b-button__text'>Играть</div>
                <a class='b-button__link' href='#3'></a>
              </div>
            </div>        
        </div>
      </file>
      <file name="style.css">
         .example-popup {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexPopup', function(){
    return {
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexPopup:template.html'
    };
});
