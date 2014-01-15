/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexLogopanel
 * @function
 *
 * @requires stmIndex.directive:stmIndexLogopanel:b-logopanel.css
 * @requires stmIndex.directive:stmIndexLogopanel:template.html
 *
 * @description
 * Logopanel
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div  stm-index-logopanel class="example-logopanel">
          <span class="b-button b-button_size_medium b-button_scheme_white">
            <span class="b-icons b-icons_arrow">
              <span class="b-icons__item"></span>
            </span>
            <span class="b-button__text">На карту</span>
            <a class="b-button__link" href="../"></a>
          </span>
        </div>
      </file>
      <file name="style.css">
         .example-logopanel {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex').directive('stmIndexLogopanel', function(){
    return {
        scope: {
            name: '@logopanel'
        },
        templateUrl: 'partials/stmIndex.directive:stmIndexLogopanel:template.html'
    };
});