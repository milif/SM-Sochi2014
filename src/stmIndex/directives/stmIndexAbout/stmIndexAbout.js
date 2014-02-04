/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexAbout
 * @function
 *
 * @requires stmIndex.directive:stmIndexAbout:b-about.css
 * @requires stmIndex.directive:stmIndexAbout:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
 *
 * @description
 * About
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div stm-index-about></div>
      </file>
      <file name="style.css">
      .b-sample {
          position:relative;
          z-index:1;
          height: 200px;
          width: 400px;
      }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexAbout', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexAbout:template.html'
    };
});
