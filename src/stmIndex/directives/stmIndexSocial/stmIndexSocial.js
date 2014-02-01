/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSocial
 * @function
 *
 * @requires stmIndex.directive:stmIndexSocial:b-social.css
 * @requires stmIndex.directive:stmIndexSocial:template.html
 * 
 * @description
 * Страница toolbar
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-social class="example-screen"></div>
      </file>
      <file name="style.css">
         .in-plunkr, .in-plunkr body, .in-plunkr .well {
            height: 100%;
            margin: 0;
         }
         .doc-example-live .example-screen {
            height: 500px;
            }
         .example-screen {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: scroll;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex')
.directive('stmIndexSocial', ['Social', function(Social){
    var BUTTONS = [
        {
            type: 'vk',
            onClick: clickVK
        },
        {
            type: 'fb',
            onClick: clickFB
        },
        {
            type: 'tw',
            onClick: clickTW
        },
        {
            type: 'gp',
            onClick: clickGP
        },
        {
            type: 'ok',
            onClick: clickOK
        }
    ]; 
    function clickVK(){
        
    }
    function clickFB(){
        
    }
    function clickTW(){
        
    }
    function clickGP(){
        
    }
    function clickOK(){
        
    }
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexSocial:template.html',
        controller: ['$attrs','$element','$scope', function($attrs, $element, $scope){
            $scope.socials = Social.get();
            $attrs.$observe('buttonsCount', function(buttonsCount){
                $scope.buttonsCount = $scope.$eval(buttonsCount) || $attrs.buttonsCount;
                var buttons = [];
                for(var i=0;i<buttonsCount;i++){
                    buttons.push(BUTTONS[i]);
                }
                $scope.buttons = buttons;
            });            
        }]
    };
}])
.factory('Social', ['$resource', function($resource){
    return $resource('api/socials.php');
}]);


