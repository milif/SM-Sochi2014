/**
 * @ngdoc directive
 * @name stmIndexPage.directive:stmIndexPageScreen
 * @function
 *
 * @requires stmIndexPage.directive:stmIndexPageScreen:b-IndexPage.css
 * @requires stmIndexPage.directive:stmIndexPageScreen:template.html
 * @requires stmIndex.directive:stmIndexMap
 * @requires stmIndex.directive:stmIndexToolbar
 * 
 * @description
 * Главная страница
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-page-screen class="example-screen"></div>
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
            background: #ffd531;
            }
      </file>
    </example>
    
 */

angular.module('stmIndexPage').directive('stmIndexPageScreen', function(){  

    var $ = angular.element;

    return {
        templateUrl: 'partials/stmIndexPage.directive:stmIndexPageScreen:template.html',
        controller: ['$scope', '$element', '$location', '$timeout', function($scope, $element, $location, $timeout){
            var pageEl = $element.find('[data-page]');
            $scope.toolbarPosition = 'bottom';
            $scope.mapPosition = {x: 600, y: 0};
            $scope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl){  
                var url = $location.url();
                if(url == '/map/') {
                    showMap();
                } else if(newUrl != oldUrl){
                    window.location.reload();
                }
            });
            $scope.$on('loaded',function(){
                $scope.showPage = true;
            });
            function showMap(e){
                $scope.pageStyle = {
                    marginTop: -pageEl.height(),
                    minWidth: 0
                };
                $scope.mapStyle = {
                    marginTop: 0,
                    height: $element.height(),
                    minWidth: 0
                };
                $scope.toolbarPosition = 'top';
                $timeout(function(){
                    $.extend($scope.mapStyle, {
                        position: 'absolute',
                        height: '100%',
                        top: 0,
                        zIndex: 20
                    });
                }, 700);
            }
        }]
    };
});

