"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexGameBanners
 * @function
 *
 * @requires stmIndex.directive:stmIndexGameBanners:b-gamebanner.css
 * @requires stmIndex.directive:stmIndexGameBanners:template.html
 * 
 * @description
 * GameBanner
 *
 * @element ANY
 * @param {String} position Позиция (top_left|bottom_left)
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-game-banners></div>
        </div>
      </file>
      <file name="style.css">
      .b-sample {
          height: 600px;
          overflow: auto;
      }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexGameBanners', function(){  
    return {
        scope: true,
        replace: true,
        transclude: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexGameBanners:template.html'
    };
});

