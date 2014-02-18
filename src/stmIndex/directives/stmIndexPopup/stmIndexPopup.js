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
 * @param {Expression=} game-data Данные о прохождении игры
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
        <div stm-index-popup game-data="4" class="example-popup"></div>
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
        scope: true,
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexPopup:template.html',
        controller: ['$scope', '$attrs', 'Mnogo', function($scope, $attrs, Mnogo){
            $scope.play = function(){
                $scope.$emit('popupPlay');
            }
            $scope.submitMnogo = function(){
                var form = $scope.mnogoForm;
                var codeField = form.code;
                if(form.$valid) {
                    $scope.mnogoIsSend = true;
                    var res = Mnogo.save({
                        code: $scope.mnogo
                    }, function(){
                        if(!res.success) {
                            codeField.$setValidity('mask', false);
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
