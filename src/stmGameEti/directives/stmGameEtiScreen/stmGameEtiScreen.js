/**
 * @ngdoc directive
 * @name stmGameEti.directive:stmGameEtiScreen
 * @function
 *
 * @requires stmGameEti.directive:stmGameEtiScreen:b-gameEti.css
 * @requires stmGameEti.directive:stmGameEtiScreen:template.html
 *
 * @description
 * Экран игры Йети
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-eti-screen class="example-screen"></div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 800px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmGameEti').directive('stmGameEtiScreen', ['$compile', '$rootScope', function($compile, $rootScope){

    var ATTEMPTS = 5; // Сколько раз можно промазать
    var NO_PHOTO_TIME = 7000; // Время без снимком (ms)
    var ITERATE_TIMEOUT = 100; // Пауза между итерациями (ms)
    var FIRST_TARGET_TIMEOUT = 3000; // Через какое время появится первая цель (ms)
    var LEVELS_TABLE = [ // Таблица уровней сложности [[ время до от начала игры (s), через какое время исчезает цель (ms), какой интервал между целями (ms), сколько целей одновременно (i)]]
        [60, 3000, 2000, 1],
        [120, 2000, 1500, 1],
        [180, 1500, 1000, 1],
        [240, 1500, 1000, 2],
        [300, 1000, 1000, 2]
    ];
    var TITLES_OUT = ["Промах!", "Мимо!", "Упс!", "Пыщь!", "Почти!"];
    var MSGS = {    
        'nophoto': ['Активнее!', "Фотографируй, а то замерзнешь", 'white'],
        'in-eti': [['Класс!', 'В точку!', ['Отличный кадр!', 230]], false, 'white'],
        'out': [TITLES_OUT, 'Будь внимательней', 'red'],
        'in-deer': 'Ты попал<br>в оленя',
        'in-beer': 'Ты попал<br>в медведя',
        'in-men': 'Ты попал<br>в мужчину',
        'in-women': 'Ты попал<br>в женщину',
        'last': 'Последний шанс'
    };
    
    
    
    var $ = angular.element;
    var alertTpl;
    
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameEti.directive:stmGameEtiScreen:template.html',
        compile: function(tElement){
            alertTpl = $compile(tElement.find('[data-alert]').remove());
        },
        controller: ['$scope', '$element', '$interval', '$animate', '$timeout', function($scope, $element, $interval, $animate, $timeout){
            
            var viewEl = $element.find('>:first');
            var backEl = viewEl.find('>:first');
            var targets = viewEl.find('[data-target]');
            var pusk = viewEl.find('[data-pusk]').remove();
            
            $scope.stateCls = 'state_stopGame';
            $scope.showBigEti = true;
            $scope.showStartPopup = true;
            $scope.position = {
                x: viewEl.width() / 2,
                y: viewEl.height() / 2
            }
            $scope.play = function(){
                $scope.showStartPopup = false;
                $timeout(function(){
                    startGame();
                }, 0);
            };
            
            var elEvents = {
                'mousemove': function(e){
                    $scope.$apply(function(){
                        var offset = $element.offset();
                        $scope.position = {
                            x: e.pageX - offset.left,
                            y: e.pageY - offset.top
                        }
                    });
                },
                'mousedown': function(e){
                    e.preventDefault();
                },
                'click': function(e){
                    photo(e);
                }          
            }
            
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
            
            $scope.$on('$destroy', function() {
                stopGame();
            });
                        
            var stopGameItem;
            var gameTime;
            
            var successMsg = MSGS['in-eti'];
            var outMsg = MSGS['out'];
            var lastMsg = MSGS['last'];
            var nophotoMsg = MSGS['nophoto'];
            
            var playAttempts;
            var nextTargetTime;
            var lastPhotoTime;
            var currentTargets;
            var currentLevel;
            
            function startGame(){
                var startTime = new Date().getTime();
                
                playAttempts = ATTEMPTS;
                nextTargetTime = new Date().getTime() + FIRST_TARGET_TIMEOUT;
                lastPhotoTime = new Date().getTime();
                currentTargets = [];
                currentLevel = LEVELS_TABLE[0];
                
                $element.on(elEvents);
                $scope.stateCls = '';
                
                $scope.showBigEti = false;
                
                stopGameItem = $interval(function(){
                    gameTime = new Date().getTime() - startTime;
                    gameIterate();
                }, ITERATE_TIMEOUT);
            }
            function gameIterate(){
                var time = new Date().getTime();
                
                if(playAttempts == 0) {
                    stopGame();
                    return;
                }
                
                if(time - lastPhotoTime > NO_PHOTO_TIME){
                    var position = $scope.position;
                    var offset = viewEl.offset();
                    showMessage(nophotoMsg, {
                        pageX: position.x + offset.left,
                        pageY: position.y + offset.top
                    });
                    lastPhotoTime = time;
                }
                
                if(gameTime > currentLevel[0] * 1000){
                    currentLevel = LEVELS_TABLE[LEVELS_TABLE.indexOf(currentLevel) + 1] || currentLevel;
                }
                
                for(var i=0;i<currentTargets.length;i++){
                    var currentTarget = currentTargets[i];
                    if(currentTarget.endTime < time) {
                        closeTarget(currentTarget);
                    }
                }
                
                if(currentTargets.length < currentLevel[3]){
                    if(nextTargetTime < time){
                        var hiddenTargets = [];
                        targets.filter(':hidden').each(function(){
                            var newEl = $(this);
                            var isIntersection = false;
                            $.each(currentTargets, function(){
                                isIntersection = checkIntersection(newEl.closest('[data-hover]'), this.el.closest('[data-hover]'));
                                return !isIntersection;                            
                            });
                            if(!isIntersection) hiddenTargets.push($(this).get(0));
                        });
                        hiddenTargets = $(hiddenTargets);
                        var el = hiddenTargets.eq(Math.round(Math.random() * (hiddenTargets.length - 1)));
                        var target = {
                            el: el,
                            endTime: time + (currentLevel[1] * 0.7 + Math.random() * currentLevel[1] * 0.6),
                            animCls: 'state_show',
                            isMove: el.data('move'),
                            isCheckTree: el.data('checkTree')
                        };
                        if(target.isMove) {
                            var width = el.closest('[data-hover]').width();
                            target.el.css('transition-duration', Math.round((target.endTime - time) * width / 1000000) + 's');
                        }
                        $animate.addClass(el, target.animCls, function(){
                            if(target.isMove) target.el.removeClass(target.animCls);
                        });

                        el.data('target', target);
                        currentTargets.push(target);                        
                    }                   
                }
            }
            function closeTarget(target){
                if(!target.isMove) $animate.removeClass(target.el, target.animCls);
                currentTargets.splice(currentTargets.indexOf(target),1);
                nextTargetTime = new Date().getTime() + (currentLevel[2] * 0.7 + Math.random() * currentLevel[2] * 0.6);
            }
            function photo(e){
            
                pusk.clone().get(0).play();
                
                lastPhotoTime = new Date().getTime();
                
                var success = false;
                var targetName;
                
                targets.filter(':visible').each(function(){
                    var el = $(this);   

                    if(inEl(el, e)) {
                        var hoverEl = el.closest('[data-hover]');
                        if(hoverEl.length == 0 || inEl(hoverEl, e)){
                            var target = el.data('target');    
                            if(target.isCheckTree && $(e.target).closest('[data-tree]').length > 0) {
                                return false;
                            }
                            if(!target.hasShoot){
                                target.hasShoot = true;
                                if(el.data('eti')) {
                                    success = true;
                                    showMessage(successMsg, e);
                                } else {
                                    targetName = MSGS[el.data('msg')];
                                }
                            }
                            
                            return false;                        
                        }
                    }
                });
                if(!success){
                    playAttempts--;
                    showMessage([outMsg[0], playAttempts == 1 ? lastMsg : targetName || outMsg[1], outMsg[2]], e);
                }
            }
            function showMessage(msg, e){
               
                var $scope = $rootScope.$new();
                var offsetLeft = viewEl.offset().left;
                var leftOrRight = offsetLeft + viewEl.width() / 2 < e.pageX;
                var title;
                var text;
                var width = 216;
                
                if($.isArray(msg[0])) {
                    title = msg[0][Math.round(Math.random() * (msg[0].length - 1))];
                } else {
                    title = msg[0];
                }
                if($.isArray(msg[1])) {
                    text = msg[1][Math.round(Math.random() * (msg[1].length - 1))];
                } else {
                    text = msg[1];
                }                
                
                if($.isArray(title)) {
                    width = title[1];
                    title = title[0];
                }
                
                $scope.title = title;
                $scope.text = text;
                $scope.mod = msg[2];
                $scope.left = e.pageX - offsetLeft + viewEl.scrollLeft() + (leftOrRight ? -300 : 100);
                $scope.top = viewEl.height() / 2 + viewEl.scrollTop() - Math.round(Math.random() * 200);
                $scope.width = width;
                                
                alertTpl($scope, function(el){
                    el.appendTo(viewEl);
                    $animate.leave(el);
                });
            }
            function stopGame(){
                $element.off(elEvents);
                $timeout(function(){
                    $scope.showStartPopup = true;
                }, 1000);
                $scope.stateCls = 'state_stopGame';
                $interval.cancel(stopGameItem);
                
                for(var i=0;i<currentTargets.length;i++){
                    closeTarget(currentTargets[i]);
                }
            }
            function checkIntersection(el1, el2){
                var offset1 = el1.offset();
                var offset2 = el2.offset();
                var bounds = [offset1.left, offset1.top, offset1.left + el1.width(), offset1.top + el1.height()];
                var points = [[offset2.left, offset2.top], [offset2.left + el2.width(), offset2.top], [offset2.left, offset2.top + el2.height()], [offset2.left + el2.width(), offset2.top + el2.height()]];
                for(var i=0;i<4;i++){
                    var point = points[i];
                    if(point[0] >= bounds[0] && point[0] <= bounds[2] && point[1] >= bounds[1] && point[1] <= bounds[3]){
                        return true;
                    }
                }
                return false;
            }
            function inEl(el, e){
                var offset = el.offset();
                var width = el.width();
                var height = el.height();
                return offset.left < e.pageX && offset.left + width > e.pageX && offset.top < e.pageY && offset.top + height > e.pageY;
            }
        }]
    };
}]);
