"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexQuiz
 * @function
 *
 * @requires stmIndex.directive:stmIndexQuiz:b-quiz.css
 * @requires stmIndex.directive:stmIndexQuiz:template.html
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
        <div class="b-sample">
            <div stm-index-quiz></div>
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


angular.module('stmIndex').directive('stmIndexQuiz', function(){
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexQuiz:template.html'
    };
});
