/**
 * @ngdoc directive
 * @name stmGameBiathlon.directive:stmGameBiathlonScreen
 * @function
 *
 * @requires stmGameBiathlon.directive:stmGameBiathlonScreen:b-gameBiathlon.css
 * @requires stmGameBiathlon.directive:stmGameBiathlonScreen:template.html
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
    
    var FPS = 25; // Число кадров в секунду
    var CAMERA_MARGIN = 20; // Минимальное расстояние игрока до правой и левой границы экрана (%)
    var CAMERA_DY = 30; // Смещение экрана по вертикали относительно точки где игрок находится по центру (%)
    
    var $ = angular.element;
        
    return {
        scope: {
        },
        templateUrl: 'partials/stmGameBiathlon.directive:stmGameBiathlonScreen:template.html',
        controller: ['$element', '$interval', '$scope', function($element, $interval, $scope){
        
            var frameViewEl = $element.find('[data-camera]');
            
            var iterator;
            var frames = [];
            var persons = [];
            var camera = {
                x: $element.width() / 2,
                y: $element.height() / 2,
                speedDX: 100,
                DX: 0
            };
            var track = {
                points: [],
                frames: []
            };
            var prevTime = new Date().getTime();
            
            initFrames($element.find('[data-track]').remove());
            initTrack();
            
            iterator = $interval(function(){
                requestAnimFrame(iterate);
            }, 1 / FPS * 1000);
            
            $scope.$on('$destroy', function() {
                $interval.cancel(iterator);
            });
            
            function iterate(){
            
                var time = new Date().getTime();
                var dTime = time - prevTime;
                
                var minX;
                var maxX;
                for(var i=0;i<persons.length;i++){
                    updatePerson(person[i], dTime);
                    minX = Math.min(person[i].x, minX || person[i].x);
                    maxX = Math.max(person[i].x, maxX || person[i].x);
                }                
                updateCamera(camera, persons, dTime);
                updateTrack(track, [(minX || 0) - camera.width, (maxX || 0) + camera.width], camera);
                for(var i=0;i<persons.length;i++){
                    updatePersonView(person[i], camera);
                }  
                
                prevTime = time;
            }
            function updatePerson(person, dTime){
            
                person.x += dTime * person.speed;
                
                while(person.x > person.toPoint.x){
                    person.fromPoint = person.toPoint;
                    person.toPoint = track.points[track.points.indexOf(person.toPoint) + 1];
                    if(!person.toPoint) {
                        addTrackFrame(track);
                        person.toPoint = person.fromPoint;
                    }
                }
                
                var p0 = person.fromPoint;
                var p1 = person.toPoint;
                
                person.y = p0.y + (p1.y - p0.y) * (p1.x - p0.x) / (person.x - p0.x);
                person.angle = getAngle([1, 0],[person.x - p0.x, person.y - p0.y]);
                
            }
            function updateCamera(camera, persons, dTime){
                
                camera.width = $element.width();
                camera.height = $element.height();
                
                if(persons.length == 0) return;
                
                var avgX = 0;
                for(var i=0;i<persons.length;i++){
                    avgX += persons[i].x / persons.length;
                }
                var margin = camera.width * CAMERA_MARGIN / 100;
                var optimalDX = Math.max( - (camera.width / 2 - margin), Math.min(avgX - mainPerson.x, camera.width / 2 - margin));
                var sign = optimalDX - camera.DX;
                sign = sign?sign<0?-1:1:0;
                if(sign > 0){
                    camera.DX = Math.min(optimalDX, camera.DX + camera.speedDX * dTime);
                } else {
                    camera.DX = Math.max(optimalDX, camera.DX - camera.speedDX * dTime);
                }
                
                camera.x = mainPerson.x + camera.DX;
                camera.y = mainPerson.y - camera.height * CAMERA_DY / 100;
                
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
                var removedFrames = frames.splice(0, count);
                for(var i=0;i<removedFrames.length;i++){
                    removedFrames[i].el.remove();
                }
                
                while(frames.length == 0 || frames[frames.length - 1].x < range[1]){
                    addTrackFrame(track);
                }
                
                var frame;
                for(var i=0;i<frames.length;i++){
                    frame = frames[i];
                    frame.el.css({
                        left: Math.round(frame.x - camera.x + camera.width / 2),
                        top: Math.round(frame.y - camera.y + camera.height / 2)
                    });
                }
                
            }
            function updatePersonView(person){
                person.css = {
                    left: Math.round(person.x - camera.x + camera.width / 2),
                    top: Math.round(person.y - camera.y + camera.height / 2),
                    transform: 'rotate(' + Math.round(person.angle) + ')'
                }   
            }
            function addTrackFrame(track){
                var frame;
                var ind;
                var lastFrame = track.frames[track.frames.length - 1];
                while(!frame){
                    ind = Math.round(Math.random() * frames.length);
                    frame = connectFrame(frames[ind] || frames[ind - 1], lastFrame);
                }
                frameViewEl.add(frame.el);
                track.frames.push(frame);
                track.points = track.points.concat(frame.points);
            }
            function connectFrame(frameEl, lastFrame){
                var points = [];
                var point;
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
                    el: frameEl.el.clone(),
                    margin: frameEl.margin,
                    points: points,
                    width: frameEl.width,
                    x: frameX,
                    y: frameY
                };
            }
            function initFrames(els){
                els.each(function(){
                    var el = $(this);
                    frames.push({
                        el: el,
                        width: el.width(),
                        margin: el.data('margin'),
                        points: el.data('points')
                    });                    
                });
            }
            function initTrack(){
                var frameEl = frames[0];
                var frame = connectFrame(frameEl, {
                    x: 0,
                    y: 0,
                    margin: [0,0]
                });
                frameViewEl.add(frame.el);
                track.frames.push(frame);
                track.points = track.points.concat(frame.points);
            }
            function getAngle(a, b){
                return Math.acos(
                    (a[0] * b[0] + a[1] * b[1]) / 
                    (Math.sqrt(a[0]*a[0] + a[1]*a[1]) * Math.sqrt(b[0]*b[0] + b[1]*b[1]))
                ) * (180 / Math.PI);
            }
        }]
    };
}]);
