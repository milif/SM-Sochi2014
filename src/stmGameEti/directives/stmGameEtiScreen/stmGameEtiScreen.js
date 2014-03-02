"use strict";
/**
 * @ngdoc directive
 * @name stmGameEti.directive:stmGameEtiScreen
 * @function
 *
 * @requires stmGameEti.directive:stmGameEtiScreen:b-gameEti.css
 * @requires stmGameEti.directive:stmGameEtiScreen:template.html
 * @requires stmIndex:playButton.html
 * @requires stmIndex:mnogoForm.html
 * @requires stmIndex:bonusInfo.html
 * @requires stmIndex:gameInfo.html
 * @requires stmIndex.directive:stmIndexPopup
 * @requires stm.filter:range
 * @requires stmIndex.$stmAchievs
 * @requires stmIndex.directive:stmIndexAchievsInfo
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
            height: 600px;
            position: relative;
            overflow:hidden;
            }
      </file>
    </example>
    
 */

angular.module('stmGameEti').directive('stmGameEtiScreen', ['$compile', '$rootScope', '$stmAchievs', function($compile, $rootScope, $stmAchievs){

    var ATTEMPTS = 5; // Сколько раз можно промазать
    var NO_PHOTO_TIME = 7000; // Время без снимком (ms)
    var ITERATE_TIMEOUT = 100; // Пауза между итерациями (ms)
    var FIRST_TARGET_TIMEOUT = 3000; // Через какое время появится первая цель (ms)
    var BONUS = 50; // Сколько очков давать за фото йети
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
    
    var achievs = $stmAchievs.yeti;
    var ACHIVE_AMONG = achievs.keys.amongstrangers;
    var ACHIVE_DEER = achievs.keys.olenevod;
    var ACHIVE_ANIMALS = achievs.keys.allinclusive;
    var ACHIEVEMENTS = [
        achievs.keys.journalist,
        ACHIVE_DEER,
        ACHIVE_ANIMALS,
        ACHIVE_AMONG
    ];
    
    var COUNT_AMONG = 100; // Сколько надо сфотографировать ети для ачива Свой среди чужих
    var COUNT_DEER = 10; // Сколько надо сфотографировать оленей для ачива Оленевод
    
    
    var $ = angular.element;
    var alertTpl;
    var countAnimals;
    
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameEti.directive:stmGameEtiScreen:template.html',
        compile: function(tElement){
            alertTpl = $compile(tElement.find('[data-alert]').remove());
            var animals = [];
            tElement.find('[data-animal]').each(function(){
                var animal = $(this).data('animal');
                if(animals.indexOf(animal) < 0) animals.push(animal);
            });
            countAnimals = animals.length;
        },
        controller: ['$scope', '$element', '$interval', '$animate', '$timeout', 'Game', 'Achiev', function($scope, $element, $interval, $animate, $timeout, Game, Achiev){
            
            var viewEl = $element.find('[data-view]');
            var backEl = viewEl.find('>:first');
            var targets = viewEl.find('[data-target]');
            var pusk = viewEl.find('[data-pusk]').remove();
            

            $scope.activateOwl = function(){
                $timeout.cancel(owlTimer);
                $scope.owlCls = 'state2';
                owlTimer = $timeout(function(){
                    $scope.owlCls = 'state1';
                    owlTimer = $timeout($scope.activateOwl, 150 + Math.random() * 150);
                }, 2000 + Math.random() * 2000);
            }
            $scope.deactivateOwl = function (){
                $timeout.cancel(owlTimer);
                owlTimer = $timeout(function(){
                    $scope.owlCls = '';
                }, 1000 + Math.random() * 1000);
            }            
            $scope.owlCls = '';
            $scope.achievsInfo = angular.copy(achievs);
            $scope.ineti = 0;
            $scope.showToolbar = false;
            $scope.attemptsCount = ATTEMPTS;
            $scope.stateCls = 'state_stopGame';
            $scope.showBigEti = true;
            $scope.showStartPopup = true;
            $scope.showGamePopup = false;
            $scope.position = {
                x: viewEl.width() / 2,
                y: viewEl.height() / 2
            }
            $scope.play = function(){
                $scope.showStartPopup = false;
                $scope.showGamePopup = false;
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
                    var targetEl = $(e.target);
                    if(targetEl.closest(viewEl).length == 0 || targetEl.closest('a').length > 0) return;
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
            $scope.$on('popupPlay', function(){
                $scope.play();
            });
                        
            var stopGameItem;
            var owlTimer;
            var redBirdTimer;
            
            var gameTime;
            var isGame = false;
            
            var successMsg = MSGS['in-eti'];
            var outMsg = MSGS['out'];
            var lastMsg = MSGS['last'];
            var nophotoMsg = MSGS['nophoto'];
            
            var nextTargetTime;
            var lastPhotoTime;
            var currentTargets;
            var currentLevel;
            var foundedEti;
            var etis;
            var startTime;
            var animals;
            
            $scope.$emit('gameInit');
            
            function startGame(){
                if(isGame) return;
                ACHIVE_DEER.count = 0;
                ACHIVE_AMONG.count = 0;
                ACHIVE_ANIMALS.count = 0;
                isGame = true;
                startTime = new Date().getTime();
                foundedEti = 0;
                etis = {};
                animals = {};
                $scope.score = 0;
                $scope.showToolbar = true;
                $scope.ineti = 0;
                $scope.attempts = ATTEMPTS;
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
                
                activateRedBird();
                
                Game.save({
                    type: 'yeti',
                    action: 'start'
                });
            }
            
            function activateRedBird(){
                $timeout.cancel(redBirdTimer);
                $scope.redBirdCls = 'state1';
                redBirdTimer = $timeout(function(){
                    $scope.redBirdCls = '';
                    redBirdTimer = $timeout(activateRedBird, 1000 + Math.random() * 1000);
                }, 1000 + Math.random() * 1000);
            }
            function deactivateRedBird(){
                $timeout.cancel(redBirdTimer);
                redBirdTimer = $timeout(function(){
                    $scope.redBirdCls = '';
                }, 1000 + Math.random() * 1000);
            }            
            function gameIterate(){
                var time = new Date().getTime();
                                
                if($scope.attempts == 0) {
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
                            animal: el.data('animal'),
                            isCheckTree: el.data('checkTree')
                        };
                        if(target.isMove) {
                            var width = el.closest('[data-hover]').width();
                            target.el.css('transition-duration', Math.round((target.endTime - time) * width / 1000000) + 's');
                        }
                        $animate.addClass(el, target.animCls, function(){
                            if(target.isMove) {
                                target.el.removeClass(target.animCls);
                                target.el.closest('[data-hover]').removeClass('state_active');
                            }
                        });
                        el.closest('[data-hover]').addClass('state_active');

                        el.data('target', target);
                        currentTargets.push(target);                        
                    }                   
                }
            }
            function closeTarget(target){
                if(!target.isMove) $animate.removeClass(target.el, target.animCls, function(){
                    target.el.closest('[data-hover]').removeClass('state_active');
                });
                currentTargets.splice(currentTargets.indexOf(target),1);
                nextTargetTime = new Date().getTime() + (currentLevel[2] * 0.7 + Math.random() * currentLevel[2] * 0.6);
            }
            function photo(e){
            
                pusk.clone().get(0).play();
                
                lastPhotoTime = new Date().getTime();
                
                var success = false;
                var targetName;
                var isAnimal = false;
                
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
                                var eti = el.data('eti'); 
                                isAnimal = !!target.animal;
                                if(!ACHIVE_ANIMALS.active && target.animal && !animals[target.animal]){
                                    animals[target.animal] = true;
                                    if(ACHIVE_ANIMALS.count++ == countAnimals - 1){
                                        saveAchiev(ACHIVE_ANIMALS);
                                    }
                                }                               
                                if(!ACHIVE_DEER.active && el.data('deer')){
                                    if(ACHIVE_DEER.count++ == COUNT_DEER - 1){
                                        saveAchiev(ACHIVE_DEER);
                                    }
                                }                                
                                
                                if(eti) {
                                    $scope.score += BONUS;
                                    $scope.ineti++;
                                    success = true;
                                    if(!ACHIVE_AMONG.active){
                                        if(ACHIVE_AMONG.count++ == COUNT_AMONG - 1){
                                            saveAchiev(ACHIVE_AMONG);
                                        }
                                    }                                    
                                    if(!etis[eti]) {
                                        etis[eti] = 0;
                                        foundedEti++;
                                    }
                                    etis[eti]++;
                                    showMessage(successMsg, e);
                                } else {
                                    targetName = MSGS[el.data('msg')];
                                }
                            } else if(el.data('eti')) {
                                success = true;
                            }
                            
                            return false;                        
                        }
                    }
                });
                if(!success){
                    if(!isAnimal) {
                        $scope.attempts--;
                    }                    
                    showMessage([outMsg[0], $scope.attempts == 1 ? lastMsg : targetName || outMsg[1], outMsg[2]], e);
                }
            }
            function saveAchiev(achiev){
                achiev.active = true;
                Achiev.save({
                    'key': 'yeti.' + achiev.type
                });            
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
                if(!isGame) return;
                isGame = false;
                $element.off(elEvents);
                $scope.stateCls = 'state_stopGame';
                $interval.cancel(stopGameItem);
                
                for(var i=0;i<currentTargets.length;i++){
                    closeTarget(currentTargets[i]);
                }
                deactivateRedBird();
                
                var time = new Date().getTime();
                
                var bestGame = Game.save({
                    type: 'yeti',
                    action: 'end',
                    score: $scope.score,
                    data: {
                        time: time - startTime,
                        final: foundedEti == $element.find('[data-eti]').length,
                        eti: {
                            founded: foundedEti,
                            total: $scope.ineti,
                            details: etis
                        }
                    }
                }, function(){
                    
                    $timeout(function(){
                        $scope.showToolbar = false;
                        $scope.showGamePopup = true;                
                    }, 700);
                    
                    var achieves = angular.copy(ACHIEVEMENTS);
                    for(var i=0;i<achieves.length;i++){
                        if(bestGame.achievements.indexOf(achieves[i].type) >= 0) {
                            achieves[i].active = true;
                        }
                    }
                    $scope.gameData = angular.extend(bestGame, {
                        type: 'yeti',
                        score: $scope.score,
                        best: {
                            score: bestGame.score
                        },
                        achievements: achieves
                    });                    
                });
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
