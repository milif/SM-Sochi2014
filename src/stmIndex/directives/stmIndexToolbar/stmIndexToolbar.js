/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexToolbar
 * @function
 *
 * @requires stmIndex.directive:stmIndexToolbar:b-toolbar.css
 * @requires stmIndex.directive:stmIndexToolbar:template.html
 *
 * @requires stmIndex.directive:stmIndexPopover
 * @requires stmIndex.directive:stmIndexSocial
 * 
 * @description
 * Страница toolbar
 *
 * @element ANY
 *
 * @param {String} position position of toolbar (bottom|top)
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-toolbar></div>
      </file>
      <file name="style.css">
         .in-plunkr, .in-plunkr body, .in-plunkr .well {
            height: 100%;
            margin: 0;
         }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexToolbar', function(){
    var GAME_MENU = [
        {
            title: "Альпинист",
            desc: "Стремление и упорство приносят результат!",
            icon: "asset/i/b-toolbar/alp.png",
            url: "climber/"
        },
        {
            title: "Биатлон",
            desc: "Точность и скорость выстрелов - залог успеха.",
            icon: "asset/i/b-toolbar/biatlon.png",
            url: "biathlon/"
        },        
        {
            title: "Фотоохота на Йети",
            desc: "Говорят, Йети не любят фотографироваться.",
            icon: "asset/i/b-toolbar/yeti.png",
            url: "yeti/"
        }
    ];
    
    var $ = angular.element;
    
    return {
        replace: true,
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexToolbar:template.html',
        controller: ['$scope', '$attrs', '$element', function($scope, $attrs, $element){
            var gameMenu = $scope.gameMenu = {
                id: 'game',
                items: GAME_MENU,
                social: true,
                position: [0,0]
            }
            
            if(!$attrs.position) $scope.position = 'bottom';
            $attrs.$observe('position', function(position){
                $scope.position = $scope.$eval(position) || $attrs.position;
            });
            
            
            var menus = $scope.menus = [
                gameMenu
            ];
            $scope.clickMenu = clickMenu;
            
            function positionMenu(e, menu){
                var el = $(e.target);
                var offset = el.offset();
                var cntOffset = $element.offset();
                var isTop = $scope.position == 'top';
                if(isTop){
                    menu.position = [-cntOffset.left + offset.left, -cntOffset.top + offset.top + el.height() ];
                } else {
                    menu.position = [-cntOffset.left + offset.left, cntOffset.top - offset.top + $element.height()];
                }
            }
            function clickMenu(e, menu){
                menu.active = !menu.active;
                positionMenu(e, menu);
            }
            $scope.$on('hidePopoverSuccess', function(e, id){
                for(var i=0;i<menus.length;i++){
                    if(menus[i].id == id){
                        menus[i].active = false;
                    }
                }
            });           
        }]
    };
});

