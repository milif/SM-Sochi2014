/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexMap
 * @function
 *
 * @requires stmIndex.directive:stmIndexMap:b-map.css
 * @requires stmIndex.directive:stmIndexMap:template.html
 *
 * @description
 * Карта
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-index-map class="example-map"></div>
      </file>
      <file name="style.css">
         .example-map {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexMap', function(){
    return {
        scope: {
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexMap:template.html',
        controller: ['$scope', '$element', function($scope, $element){
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            
            $scope.position = {
                x: viewEl.width() / 2, 
                y: viewEl.height() / 2
            }                
            
            $element.on('mousemove', function(e){
                var offset = $element.offset();
                $scope.$apply(function(){
                    $scope.position = {
                        x: e.pageX - offset.left,
                        y: e.pageY - offset.top
                    }
                });
            });
            $element.on('mousedown', function(e){
                e.preventDefault();
            });
            $scope.$watch('position', function(){
                var viewW = viewEl.width();
                var backW = backEl.width();
                var marginW = viewW * 0.15;
                var viewH = viewEl.height();
                var backH = backEl.height();
                var marginH = viewH * 0.15;
                
                var offset= Math.min(viewW-2*marginW, Math.max($scope.position.x - marginW, 0));
                var scrollLeft = Math.round(offset * (backW-viewW)/(viewW - marginW * 2));
                viewEl.scrollLeft(scrollLeft);
                offset= Math.min(viewH-2*marginH, Math.max($scope.position.y - marginH, 0));
                var scrollTop = Math.round(offset * (backH-viewH)/(viewH - marginH * 2));
                viewEl.scrollTop(scrollTop);
            });
        
        }]
    };
});
