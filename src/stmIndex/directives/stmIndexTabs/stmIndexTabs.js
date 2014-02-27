/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexTabs
 *
 * @requires stmIndex.directive:stmIndexTabs:b-tabs.css
 *
 * @description
 * Табы подсказок
 *
 * @element ANY
 *

 *
 */
angular.module('stmIndex').directive('stmIndexTabs', ['$animate', function($animate){
    var cls = 'state_active';
    return function(scope, iElement){
       var activeEl = iElement.find('[data-active]');
       var index = activeEl.length > 0 ? activeEl.parent().children().index(activeEl) : 0;
       setTimeout(function(){
            iElement.find('>:eq('+(index+1)+'),>*>:eq('+index+'),>*>:eq('+index+') [tab-active]').addClass('state_active');
       }, 0);
       iElement.on('click','> :first > *',function(){
            var el = $(this);
            if(el.hasClass(cls)) return;
            var index = el.parent().children().index(el);
            iElement.find('>:first >.' + cls + ',> .' + cls+',[tab-active].'+cls).removeClass(cls);
            iElement.find('>*>:eq('+index+'),>*>:eq('+index+') [tab-active]').addClass(cls);
            $animate.addClass(iElement.find('>:eq('+(index+1)+')'), cls);
            
            scope.$broadcast('activeTab', index);
       });
    }
}])
