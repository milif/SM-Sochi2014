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
    var socials = Social.get();
    var BUTTONS = [
        {
            type: 'vk',
            count: socials.vk,
            onClick: clickVK
        },
        {
            type: 'fb',
            count: socials.fb,
            onClick: clickFB
        },
        {
            type: 'tw',
            count: 1234,
            onClick: clickTW
        },
        {
            type: 'gp',
            count: socials.gp,
            onClick: clickGP
        },
        {
            type: 'ok',
            count: socials.ok,
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
    return $resource('api/socials.php',{},{
    });
}]);


