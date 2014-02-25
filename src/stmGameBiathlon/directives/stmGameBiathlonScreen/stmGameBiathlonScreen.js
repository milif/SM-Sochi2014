/**
 * @ngdoc directive
 * @name stmGameBiathlon.directive:stmGameBiathlonScreen
 * @function
 *
 * @requires stmGameBiathlon.directive:stmGameBiathlonScreen:b-gameBiathlon.css
 * @requires stmGameBiathlon.directive:stmGameBiathlonScreen:template.html
 * @requires stmGameBiathlon.directive:stmGameBiathlonWarningPopup
 * @requires stmIndex.directive:stmIndexPopup
 * @requires stmIndex.directive:stmIndexButtonsPopup
 * @requires stmIndex.directive:stmIndexBonus
 * @requires stmIndex.directive:stmIndexBonusPopup 
 * @requires stmIndex.$stmBonus
 * @requires stmIndex.directive:stmIndexPopover
 * @requires stm.filter:range
 *
 * @description
 * Экран игры Биатлон
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-biathlon-screen class="example-screen"></div>
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
            overflow: hidden;
            }
      </file>
    </example>
    
 */

angular.module('stmGameBiathlon').directive('stmGameBiathlonScreen', [function(){    
    
    var FPS = 40; // Число кадров в секунду
    var CAMERA_MARGIN = 20; // Минимальное расстояние игрока до правой и левой границы экрана (%)
    var CAMERA_DY = 30; // Смещение экрана по вертикали относительно точки где игрок находится по центру (%)
    var START_FRAME = "1"; // Начальный кусок трассы
    var COUNT_TREES = 10; // Максимальное число деревьев на фрейме
    var COUNT_TREES_NEAR = 3; // Максимальное число деревьев в куче
    var TREES_DISTANCE = 300; // Оптимальное расстояние между деревьями в куче (px)
    var K = 140 / 397; // Коэфф. угла выстрела
    var START_MORE_SPEED = 5; // Начальное число ускорений
    var ADD_SPEED = 100; // На сколько увеличивать скорость игрока
    var DOWN_SPEED = 10; // На сколько уменьшать скорость игрока за секунду
    var PLAYER_SPEED = 400; // Начальная скорость игрока
    var MAX_SPEED = 1000; // Максимальная скорость игрока
    var ETI_SPEED = 450; // Скорость йети
    var ETI_МАX_SPEED = 900; // Максимальная скорость йети
    var UP_ETI_SPEED = 20; // На сколько увеличивать скорость ети за секунду
    var JUMP_TIME = 1; // Сколько секунд длится прыжок
    var JUMP_HEIGHT = 100; // Высота прыжка (px)
    var BONUS_SUMM = 50; // Сколько прибавлять очков 
    //var BONUSES_COUNT = 50; // Число бонусов на игру    
    var BONUSES_DISTANCE = 1000; // Оптимальное расстояние между бонусами 
    var BONUS_JUMP = { // Надо подпрыгнуть
        y: JUMP_HEIGHT + 75,
        type: 'jump'
    };
    var BONUS_GO = { // На трассе
        y: 60,
        type: 'go'
    };
    var BUTTONS_CHANGE_MIN_TIME = 3000; // Минимальное время между сменой подсказок
    var BUTTONS_TIME = 2000; // Время показа подсказки
    var BUTTONS = {
        'shoot': {
            key: 'space',
            text: 'Жми <b>«пробел»</b> для<br>стрельбы по мишеням!'
        },
        'speed': {
            key: 'right',
            text: 'Жми стрелку <b>«вправо»</b><br>для ускорения!'
        },
        'down': {
            key: 'bottom',
            text: 'Жми стрелку <b>«вниз»</b><br>чтобы набрать скорость!'
        }
    }
    
    var $ = angular.element;
    
    var ACHIVE_IRON = {
            type: 'ironnerves',
            text: 'Железные нервы'            
        };
    var ACHIVE_LOIN = {
            type: 'lionheart',
            text: 'Храбрец',
            count: 0            
        }; 
    var ACHIVE_LASTHERO = {
            type: 'lasthero',
            text: 'Последний герой'            
        };
    var ACHIVE_STARHOOTER = {
            type: 'starshooter',
            text: 'Звездный стрелок'            
        };               
    var ACHIEVEMENTS = [
        {
            type: 'journalist',
            text: 'Журналист'            
        },
        ACHIVE_IRON,
        ACHIVE_LOIN,        
        ACHIVE_LASTHERO,
        ACHIVE_STARHOOTER
    ];  
    
    var PIXEL_IN_METER = 20; // Сколько пикселей в метре
    var METERS_IRONNERVES = 5000; // Когда давайть ачив Железные нервы
    var METERS_LIONHEART = 10; // Как надо сблизится с Ети для ачива Храбрец
    var COUNT_LIONHEART = 5; // Сколько раз надо сблизится с Ети для ачива Храбрец
    var TIME_LASTHERO = 15; // Сколько минут надо продержаться в игре для ачива Последний герой
    var COUNT_STARHOOTER = 3; // Сколько мишеней надо порязить для ачива Звездный стрелок
          
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameBiathlon.directive:stmGameBiathlonScreen:template.html',
        controller: ['$element', '$interval', '$scope', '$window', '$timeout', 'Game', 'Achiev','$stmBonus', function($element, $interval, $scope, $window, $timeout, Game, Achiev, $stmBonus){
                    
            var iterator;
            
            var isGame = false;
            var isShootingHelp = true;
            var isSpeedHelp = true;
            var isDownHelp = true;
            var gameTime = 0;
            var showKeyHelpActiveTime = 0;
            var lastShootTime;
            var disableShootTime;
            var inSeet = false;
            var inJump = false;
            var shootCount = 0;
            var moreSpeedAttempts;
            var framesEl = {};
            var treesEl = [];
            var bonusPlaces = [BONUS_JUMP];
            //var bonuses = 0;
            var bonusId = 0;
            var etiWarinigTime = 0;
            var etiWarinigCloseTime = 0;
            var shootSound = $element.find('[data-shoot]').remove();
            var finalDistance;
            var targetsShoots;
            var camera = {
                x: $element.width() + 400,
                y: $element.height() / 2,
                speedDX: 0.2,
                DX: -400,
                DY: $element.height() * 0.3
            };
            var men = {
                x: camera.x,
                y: camera.y,
                angle: 0,
                framePerSec: 4,
                frameCount: 4,
                update: updatePlayer
            };
            var eti = {};
            var persons = [men];           
            var track = {
                points: [],
                frames: []
            };
            var buttons = $scope.buttons = {
                active: false,
                key: 'space',
                text: ''
            };
            
            var prevTime = new Date().getTime();
            
            var iterateTasks = [];
            var startX;
            
            var globalEvents = {
                'keydown': function(e){
                    if ($scope.inEti) return;
                    if(e.which == 32) {
                        var time = new Date().getTime();
                        if(inJump || inSeet || time < disableShootTime || men.angle > 35) return;
                        if(shootCount++ < 5) {
                            shootSound.clone().get(0).play();
                            $scope.$apply(function(){
                                lastShootTime = time;                             
                                shoot(time);
                            });                        
                        } else {
                            disableShootTime = time + 200;                            
                        }                     
                    } if(e.which == 40 ) {
                        if(inJump || time < disableShootTime || men.angle < 35) return;
                        inSeet = true;
                        isDownHelp = false;                                     
                    } else if(e.which == 39){
                        if(!inJump && !inSeet && moreSpeedAttempts > 0){
                            men.speed += ADD_SPEED;
                            moreSpeedAttempts--;
                            $scope.speeds = moreSpeedAttempts;
                            isSpeedHelp = false;
                        }
                    } else if(e.which == 38){
                        if(!inJump && !inSeet && men.angle < 35){
                            addIterateTask(jump);
                        }
                    }
                },
                'keyup': function(e){
                    if(e.which == 40 ) {
                        inSeet = false;
                    }
                }
            }
            
            initFrames($element.find('[data-track]'));
            initTrees($element.find('[data-tree]'));
            initTrack();
            
            iterator = setInterval(function(){
                $scope.$apply(function(){
                    requestAnimationFrame(iterate);  
                });                         
            }, 1 / FPS * 1000);
            
            var bonusPopups = $scope.bonusPopups = [];
            $scope.speedsMax = START_MORE_SPEED;
            $scope.men = men;
            $scope.eti = eti;
            $scope.traceFrames = track.frames;
            $scope.showStartPopup = true;
            $scope.showInfoPopup = false;
            $scope.showInfo = function(){
                $scope.showInfoPopup = true;
            }
            $scope.closeInfo = function(){
                $scope.showInfoPopup = false;
            }
            $scope.play = startGame;
            $scope.$on('$destroy', function() {
                clearInterval(iterator);
            });
            $scope.$on('hidePopoverSuccess', function(e, id) {
                for(var i=0; i<bonusPopups.length;i++){
                    if(bonusPopups[i].id == id){
                        bonusPopups.splice(i,1);
                        break;
                    }
                }
            });
            $scope.$on('popupPlay', function(){
                $scope.play();
            });            
            $scope.$emit('gameInit');
            
            function startGame(){
                $stmBonus.reset();
                targetsShoots = 0;
                startX = men.x;
                $scope.etiWarinig = false;
                men.speed = PLAYER_SPEED;
                inSeet = false;
                $scope.score = 0;
                $scope.showToolbar = true;
                $scope.eti = eti = {
                    x: men.x - camera.width * 1.3,
                    y: men.y,
                    angle: 0,
                    framePerSec: 4,
                    frameCount: 4,
                    frameInEtiCount: 3,
                    speed: ETI_SPEED,
                    update: updateEti
                };
                persons.push(eti);
                
                gameTime = 0;
                //bonuses = BONUSES_COUNT;
                $scope.showStartPopup = false;
                isGame = true;
                $scope.inEti = false;
                $scope.speeds = moreSpeedAttempts = START_MORE_SPEED;
                gameTime = new Date().getTime();
                $($window).on(globalEvents);
                Game.save({
                    type: 'biathlon',
                    action: 'start'
                });                
            }
            function stopGame(){  
                buttons.active = false;
                $scope.showToolbar = false;             
                isGame = false;
                $scope.showStartPopup = true;
                $($window).off(globalEvents);
                persons.splice(persons.indexOf(eti), 1);
                
                var time = new Date().getTime();
            }
            function iterate(){
            
                var time = new Date().getTime();
                var dTime = time - prevTime;
                
                var minX;
                var maxX;
                for(var i=0;i<persons.length;i++){
                    updatePerson(persons[i], dTime, time - gameTime);
                    minX = Math.min(persons[i].x, minX || persons[i].x);
                    maxX = Math.max(persons[i].x, maxX || persons[i].x);
                }      
                updateCamera(camera, persons, dTime);
                updateTrack(track, [(minX || 0) - camera.width, (maxX || 0) + camera.width], camera);
                
                for(var i=0;i<iterateTasks.length;i++){
                    if(iterateTasks[i].iterate(time, dTime)) {
                        (iterateTasks[i].done || angular.noop)();
                        iterateTasks.splice(i,1);
                        i--;
                    }
                }                
                
                for(var i=0;i<persons.length;i++){
                    updatePersonView(persons[i], camera, time - gameTime, dTime);
                }  
                
                if( isSpeedHelp && men.x - eti.x < 600){
                    showKeyHelp(BUTTONS['speed']);
                }
                
                if(!isGame || men.x < eti.x || time - showKeyHelpActiveTime > BUTTONS_TIME){
                    buttons.active = false;
                }
                if($scope.etiWarinig && etiWarinigCloseTime < time){
                    $scope.etiWarinig = false;
                }
                
                $scope.ready = true;
                
                prevTime = time;
            }
            function addIterateTask(task, done){
                iterateTasks.push({
                    iterate: task,
                    done: done
                });
                
            }        
            function jump(time, dTime){
                if(!inJump){
                    this.endTime = time + JUMP_TIME * 1000;
                    this.angle = men.angle;
                    inJump = true;
                }
                if(this.endTime < time) {
                    men.DY = 0;
                    inJump = false;
                    return true;
                }
                men.angle = Math.min(0, this.angle || 0);
                men.DY = Math.sin(Math.PI * (this.endTime - time) / (JUMP_TIME * 1000)) * JUMP_HEIGHT;
            }
            function updatePerson(person, dTime, gTime){
            
                if(isGame) {
                    person.x += dTime / 1000 * person.speed;
                }
                
                if(!person.toPoint) {
                    var point;
                    for(var i=0;i<track.points.length;i++){
                        point = track.points[i];
                        if(person.x <= point.x) {
                            person.toPoint = point;
                            person.fromPoint = track.points[i-1];
                            break;
                        }
                    }
                }
                        
                while(person.x > person.toPoint.x){
                    person.fromPoint = person.toPoint;
                    person.toPoint = track.points[track.points.indexOf(person.toPoint) + 1];
                    if(!person.toPoint) {
                        addTrackFrame(track);
                        person.toPoint = person.fromPoint;
                    }
                }
                if(!person.fromPoint){
                    person.fromPoint = {
                        x: person.x - 100,
                        y: person.y
                    }
                }
                
                var p0 = person.fromPoint;
                var p1 = person.toPoint;
                
                var y = getY(p0, p1, person.x);
                if(!isNaN(y)) person.y = y;
                
                var angle = getAngle(p0, person);
                if(!isNaN(angle)) person.angle = angle;
               
            }
            function updateCamera(camera, persons, dTime){
                
                camera.width = $element.width();
                camera.height = $element.height();
                
                if(persons.length == 0) return;
                
                /*
                var avgX = 0;
                for(var i=0;i<persons.length;i++){
                    avgX += persons[i].x / persons.length;
                }
                */
                var margin = camera.width * CAMERA_MARGIN / 100;
                
                var optimalDY = Math.min(- camera.height * CAMERA_DY / 100 + Math.abs(men.angle) / 50 * camera.height * 0.6, camera.height / 2 * 0.3);
                
                if(isGame){
                    var optimalDX = 
                        + Math.abs(men.angle) / 50 * camera.width * 0.5;
                        //+ Math.max( - (camera.width / 2 - margin), Math.min(avgX - men.x, camera.width / 2 - margin));
                    if(!camera.setDX || Math.abs(optimalDX - camera.setDX) > 100) {
                        camera.setDX = optimalDX;
                    }
                    var sign = camera.setDX - camera.DX;
                    sign = sign?sign<0?-1:1:0;
                    if(sign > 0){
                        camera.DX = Math.min(camera.setDX, camera.DX + camera.speedDX * dTime);
                    } else {
                        camera.DX = Math.max(camera.setDX, camera.DX - camera.speedDX * dTime);
                    }
                    
                    
                    if(!camera.setDY || Math.abs(optimalDY - camera.setDY) > 100) {
                        camera.setDY = optimalDY;
                    }
                    var sign = camera.setDY - camera.DY;
                    sign = sign?sign<0?-1:1:0;
                    if(sign > 0){
                        camera.DY = Math.min(camera.setDY, camera.DY + camera.speedDX * dTime);
                    } else {
                        camera.DY = Math.max(camera.setDY, camera.DY - camera.speedDX * dTime);
                    }                    
                    
                    
                } else {
                    if(!$scope.inEti) camera.DY = optimalDY;
                }            

                camera.x = men.x + camera.DX;
                camera.y = men.y + camera.DY;
                
            }
            function updateTrack(track, range, camera){
                var points = track.points;
                var frames = track.frames;
                var count = 0;
                while(points[count] && points[count].x < range[0]){
                    count++;                    
                }
                points.splice(0, count);
                
                var count = 0;
                while(frames[count] && frames[count].x + frames[count].width < range[0]){
                    count++;       
                }
                frames.splice(0, count);
                
                while(frames.length == 0 || frames[frames.length - 1].x < range[1]){
                    addTrackFrame(track);
                }
                
                var frame, target, targetDist;
                for(var i=0;i<frames.length;i++){
                    frame = frames[i];
                    if(isShootingHelp){
                        for(var _i=0;_i<frame.targets.length;_i++){
                            target = frame.targets[_i];
                            targetDist = target.css.left + frame.x - men.x;
                            if(targetDist < 400 && targetDist > -200) {
                                showKeyHelp(BUTTONS.shoot);
                            }
                        }
                    }
                    frame.css = {
                        left: Math.round(frame.x - camera.x + camera.width / 2),
                        top: Math.round(frame.y - camera.y + camera.height / 2)
                    };
                }
                
            }

            function showKeyHelp(help){
                var time = new Date().getTime();
                if(!isGame || time - showKeyHelpActiveTime < BUTTONS_CHANGE_MIN_TIME) return;
                showKeyHelpActiveTime = time;
                buttons.text = help.text;
                buttons.key = help.key;
                buttons.active = true;
            }
            function updatePlayer(time, gTime, dTime){
                if(isGame) {
                    if(this.angle < 35) inSeet = false;
                    if( isDownHelp && this.angle > 35){
                        showKeyHelp(BUTTONS['down']);
                    }
                    this.framePerSec = Math.min(Math.max(2, Math.round(this.speed / PLAYER_SPEED * 4)), 6);
                    if(time - lastShootTime < 300) {
                        this.frameIndex = 'shoot';
                        this.angle = 0;
                    } else if(inSeet) {
                        this.frameIndex = 'seet';
                    } else if(inJump) {
                        this.frameIndex = 'jump';
                    } else {
                        shootCount = 0;
                        this.frameIndex = Math.round(gTime / 1000 * this.framePerSec) % this.frameCount;
                    }
                    if(!$scope.inEti){
                        var downSpeed = DOWN_SPEED * dTime / 1000 - this.angle * dTime / 1000;
                        if(!inSeet) downSpeed = Math.max(0, downSpeed);                     
                        this.speed -= downSpeed;
                        
                        this.speed = Math.min(MAX_SPEED, this.speed);
                        
                        if(time > etiWarinigTime && men.speed < eti.speed && men.x - eti.x < camera.width / 1.5){
                            $scope.etiWarinig = true;
                            etiWarinigTime = time + 5000;
                            etiWarinigCloseTime = time + 2000;
                        }
                        if(this.x <= eti.x) {
                            finalDistance = this.x - startX;
                            $scope.inEti = true;
                            
                            endGame();
                        }
                    }
                    if(this.speed < 20) stopGame();
                    
                } else {
                    this.frameIndex = 'start';
                } 
                
                if(!isGame || $scope.inEti) return;
                var frame, bonus, bonusDist;
                for(var i=0;i<track.frames.length;i++){
                    frame = track.frames[i];

                    for(var _i=0;_i<frame.bonuses.length;_i++){
                        bonus = frame.bonuses[_i];
                        if(bonus.take) continue;
                        bonusDist = bonus.position[0] + frame.x - men.x;
                        if(bonus.show) {
                            if(Math.abs(bonusDist) < 50){
                                if(Math.abs(men.y -70 - men.DY - (bonus.position[1] + frame.y)) < 30) {
                                    bonus.show = false;
                                    bonus.take = true;
                                    
                                    var bonusScore = bonus.item.put();
                                    
                                    $scope.score += bonusScore;
                                    
                                    //bonuses--;
                                    showBonusPopup({
                                        bonus: bonusScore,
                                        id: bonusId++,
                                        type: bonus.item.type,
                                        position: [Math.round($element.width() -400 + Math.random() * 100), Math.round(50 + Math.random() * 50 )]
                                    });
                                }
                            }
                            if(!bonus.item.hasAvailable()){
                                bonus.show = false;
                            }
                        } else {
                            if(bonusDist > 0 && bonusDist < 800 + Math.random() * 200 && bonus.item.hasAvailable()) {
                                bonus.show = true;
                            } 
                        }
                    }
                }              
                
                if(!ACHIVE_IRON.active && men.x / PIXEL_IN_METER - startX > METERS_IRONNERVES){
                    saveAchiev(ACHIVE_IRON);
                } 
                if(!ACHIVE_LOIN.active){
                    if((men.x - eti.x) / PIXEL_IN_METER < METERS_LIONHEART) {
                        if(!ACHIVE_LOIN._in) {
                            ACHIVE_LOIN._in = true;
                            if(ACHIVE_LOIN.count++ == COUNT_LIONHEART -1){
                                saveAchiev(ACHIVE_LOIN);                                
                            }
                        }
                    } else {
                        ACHIVE_LOIN._in = false;
                    }                
                }
                if(!ACHIVE_LASTHERO.active && time - gameTime > TIME_LASTHERO * 60000){
                    saveAchiev(ACHIVE_LASTHERO);                  
                }
                
            }
            function endGame(time){
                var scoreDetails = $stmBonus.getScores();
                var bestGame = Game.save({
                    type: 'biathlon',
                    action: 'end',
                    score: $scope.score,
                    data: {
                        time: new Date().getTime() - gameTime,
                        final: !$stmBonus.hasAvailable(),
                        distance: Math.round(finalDistance),
                        score: scoreDetails
                    }
                }, function(){
                    var achieves = angular.copy(ACHIEVEMENTS);
                    for(var i=0;i<achieves.length;i++){
                        if(bestGame.achievements.indexOf(achieves[i].type) >= 0) {
                            achieves[i].active = true;
                        }
                    }
                    var items = [];
                    for(var type in scoreDetails){
                        items.push({
                            type: type,
                            score: scoreDetails[type]
                        });
                    }
                    if(items.length == 0) items = null;
                    $scope.gameData = angular.extend(bestGame, {
                        type: 'biathlon',
                        score: $scope.score,
                        best: {
                            score: bestGame.score,
                            items: items
                        },
                        achievements: achieves
                    });             
                });                                                   
            
            }
            function saveAchiev(achiev){
                achiev.active = true;
                Achiev.save({
                    'key': 'biathlon.' + achiev.type
                });            
            }
            function showBonusPopup(popup){
                bonusPopups.push(popup);
                $timeout(function(){
                    $scope.$broadcast('hidePopover-'+popup.id);
                }, 2000);
            }
            function updateEti(time, gTime, dTime){
                if(isGame) {
                    this.speed += UP_ETI_SPEED * dTime / 1000;
                    
                    if(!$scope.inEti && men.x - this.x < camera.width) {
                        this.speed = Math.min(this.speed, men.speed + 100);
                        if(men.x - this.x < camera.width / 2) {
                            this.speed = Math.min(ETI_МАX_SPEED, this.speed);
                        }
                    }
                    this.frameIndex = Math.round(gTime / 1000 * this.framePerSec) % ($scope.inEti ? this.frameInEtiCount : this.frameCount);
                    if(this.x > camera.x + camera.width / 2 + 200) {
                        stopGame();
                    }
                }               
            }
            function updatePersonView(person, camera, gTime, dTime){
                var time = new Date().getTime();
                person.update(time, gTime, dTime);
                person.css = {
                    left: Math.round(person.x - camera.x + camera.width / 2),
                    top: Math.round(person.y - camera.y + camera.height / 2) - (person.DY || 0),
                    transform: 'rotate(' + Math.round(person.angle) + 'deg)'
                }   
            }
            function shoot(time){
            
                var panelWidth = 224;
                var frame, target, targetX, targetY;
                var find = false;
                for(var i=0;i<track.frames.length;i++){
                    frame = track.frames[i];
                    if(frame.x + frame.width < men.x) continue;
                    for(var k=0;k<frame.targets.length;k++){
                        target = frame.targets[k];
                        targetX = target.css.left + frame.x;
                        targetY = target.css.top + frame.y;
                        if(targetX + panelWidth > men.x) {
                            find = true;
                            break;
                        }
                    }
                    if(find) break;
                }
                if(!find) return;
                targetsShoots++;
                if(!ACHIVE_STARHOOTER.active && targetsShoots >= COUNT_STARHOOTER ){
                    saveAchiev(ACHIVE_LASTHERO);                
                }                                
                isShootingHelp = false;
                var shootX = targetX - K * (men.y - targetY);               
                if(men.x > shootX && men.x < shootX + panelWidth) {
                    var point = Math.floor((men.x - shootX) / panelWidth * 5);
                    if(!target.points[point] && moreSpeedAttempts < START_MORE_SPEED) moreSpeedAttempts++;
                    $scope.speeds = moreSpeedAttempts;
                    target.points[point] = true;
                }
            }
            function addTrackFrame(track){
                var frame;
                var ind;
                var lastFrame = track.frames[track.frames.length - 1] || {
                    x: 0,
                    y: 0,
                    width: 0,
                    margin: [0, framesEl[START_FRAME].margin[0]],
                    nextFrames: [START_FRAME]
                };
                frame = connectFrame(lastFrame);
                track.frames.push(frame);
                track.points = track.points.concat(frame.points);
            }
            function connectFrame(lastFrame){
                var points = [];
                var point;
                
                var frames = lastFrame.nextFrames;
                var ind = Math.round(Math.random() * (frames.length + 0.5) - 0.5);                
                var frameEl = framesEl[frames[ind] || frames[ind - 1]];               
               
                var frameX = lastFrame.x + lastFrame.width;
                var frameY = lastFrame.y + lastFrame.margin[1] - frameEl.margin[0];
                for(var i=0;i<frameEl.points.length;i++){
                    point = frameEl.points[i];
                    points.push({
                        x: frameX + point[0],
                        y: frameY + point[1]
                    });
                }
                return {
                    name: frameEl.name,
                    margin: frameEl.margin,
                    points: points,
                    trees: getTrees(frameEl),
                    bonuses: getBonuses(frameEl),
                    targets: getTargets(frameEl),
                    width: frameEl.width,
                    x: frameX,
                    y: frameY,
                    nextFrames: frameEl.nextFrames
                };
            }

            function getBonuses(frameEl){
                var frameBonuses = [];
                var place;                
                var x = frameEl.points[0][0];
                var y;
                var data = {};
                var types = $stmBonus.getAvailableTypes();
                var bonusItem;
                while(types.length > 0){
                    x += 0.75 * BONUSES_DISTANCE + Math.random() * BONUSES_DISTANCE * 0.5;
                    if(x > frameEl.width) break;
                    y =  getFrameY(frameEl, x, data);
                    place = data.angle > 35 ? BONUS_GO : bonusPlaces[Math.floor(Math.random() * bonusPlaces.length + 1) % bonusPlaces.length];
                    if(isNaN(y)) continue;
                    bonusItem = types[Math.floor(Math.random() * types.length + 1) % types.length];
                    frameBonuses.push({
                        position: [x, y - place.y],
                        place: place,
                        id: bonusId++,
                        show: false,
                        item: bonusItem,
                        type: bonusItem.type
                    });
                }
                return frameBonuses;
            }
            function getFrameY(frameEl, x, data){
                var pointTo, y, pointFrom;
                for(var k=0;k<frameEl.points.length;k++){
                    pointTo = frameEl.points[k];
                    if(x <= pointTo[0]){
                        pointFrom = frameEl.points[k-1];
                        break;
                    }
                }
                if(!pointTo || !pointFrom) return NaN;
                pointTo = {x: pointTo[0], y: pointTo[1]};
                pointFrom = {x: pointFrom[0], y: pointFrom[1]};
                y = getY(pointFrom, pointTo, x); 
                if(data) data.angle = getAngle(pointFrom, pointTo);
                return y;
            }
            function getTargets(frameEl){
                if(!isGame) return [];
                var time = new Date().getTime();
                var gTime = time - gameTime;
                var range = frameEl.targetsRange;
                var targets = [];
                var x = Math.random() * men.speed / PLAYER_SPEED < 0.5 ? [range[0] + (range[1] - range[0]) * Math.random()] : [];
                var y;

                for(var i=0; i<x.length;i++){  
                    y =  getFrameY(frameEl, x[i]);
                    if(isNaN(y)) continue;                  
                    targets.push({
                        css: {
                            top: Math.round(y) - Math.max(450, camera.height * 0.65),
                            left: Math.round(x[i])
                        },
                        points: [false, false, false, false, false]
                    });
                }

                return targets;
            }
            function getTrees(frameEl){
                var trees = [];
                var count = Math.round((Math.random() * 0.5 + 0.5) * COUNT_TREES);
                var x, angle, y, tree, ind, count_group;
                
                while(count > 0){
                    count_group = Math.round(COUNT_TREES_NEAR * Math.random());
                    x = Math.round(150 + Math.random() * frameEl.width - 150);
                    while(count_group > 0 && x < frameEl.width - 150){
                        x += TREES_DISTANCE * (0.5 + Math.random());
                        ind = Math.round(Math.random() * (treesEl.length + 0.5) - 0.5);
                        var treeEl = treesEl[ind] || treesEl[ind - 1];
                        y =  getFrameY(frameEl, x);
                        if(isNaN(y)) continue;

                        count_group--;
                        count--;
                        
                        trees.push({
                            name: treeEl.name,
                            css: {
                                zIndex: Math.round(Math.random() * 9),
                                top: Math.round(y),
                                left: Math.round(x),
                                transform: 'rotate('+Math.round(-10 + Math.random() * 20)+'deg)'
                            }
                        });
                        
                    }
                }  
                return trees;         
            }
            function initFrames(els){
                els.each(function(){
                    var el = $(this);
                    framesEl[el.data('track')] = {
                        width: el.width(),
                        name: el.data('track'),
                        margin: el.data('margin'),
                        points: el.data('points'),
                        targetsRange: el.data('targetsRange'),
                        nextFrames: el.data('frames')
                    }; 
                    el.remove();                 
                });
            }
            function initTrees(els){
                els.each(function(){
                    var el = $(this);
                    treesEl.push({
                        name: el.data('tree')
                    });    
                    el.remove();               
                });               
            }
            function initTrack(){
                addTrackFrame(track);
            }
            function getY(p0, p1, x){
                return p0.y + (p1.y - p0.y) / (p1.x - p0.x) * (x - p0.x);
            }
            function getAngle(p0, p1){
                var a = [1, 0]
                var b = [p1.x - p0.x, p1.y - p0.y];
                return (b[1] < 0 ? -1 : 1) * Math.acos(
                    (a[0] * b[0] + a[1] * b[1]) / 
                    (Math.sqrt(a[0]*a[0] + a[1]*a[1]) * Math.sqrt(b[0]*b[0] + b[1]*b[1]))
                ) * (180 / Math.PI);
            }
        }]
    };
}]);
