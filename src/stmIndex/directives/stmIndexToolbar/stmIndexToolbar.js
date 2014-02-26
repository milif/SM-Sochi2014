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
 * @requires stmIndex.directive:stmIndexTooltip
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
         <div position="bottom" stm-index-toolbar></div>
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
            desc: "Точность и скорость выстрелов &mdash; залог успеха.",
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
        controller: ['$scope', '$attrs', '$element', '$location', '$stmAuth', function($scope, $attrs, $element, $location, $stmAuth){
            var url = $location.url();
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
            
            $scope.isAccount = /account/.test(url);
            $scope.auth = function(){
                $stmAuth.auth(function(){
                    $location.url('/account/');
                });
            }
            $scope.$watch(function(){
                if($scope.isAuth) return;

                $scope.isAuth = $stmAuth.isAuth;
                if(!$scope.isAuth) return;
                
                var name = $stmAuth.data.name;
                $scope.avatar = $stmAuth.data.photo || 'asset/i/b-toolbar/user.png';
                $scope.name = name.first_name + " " + name.last_name;                
            });

            
            var menus = $scope.menus = [
                gameMenu
            ];
            $scope.betaInfo = {};
            $scope.clickBetaInfo = clickBetaInfo;
            $scope.clickMenu = clickMenu;
            $scope.isAbout = /about/.test(url);
            $scope.logoClick = function (){
                $scope.$emit('toolbarLogoClick');
            }
            
            function positionMenu(e, menu){
                var el = $(e.target);
                var offset = el.offset();
                var cntOffset = $element.offset();
                var isTop = $scope.position == 'top';
                if(isTop){
                    menu.position = [-cntOffset.left + offset.left, -cntOffset.top + offset.top + el.outerHeight() ];
                } else {
                    menu.position = [-cntOffset.left + offset.left, cntOffset.top - offset.top + $element.outerHeight()];
                }
            }
            function clickBetaInfo(e){
                clickMenu({target: $(e.target).parent()}, $scope.betaInfo);
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
                if(id == 'beta') {
                    $scope.betaInfo.active = false;
                }
            });           
        }]
    };
});

