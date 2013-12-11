/**
 * @ngdoc directive
 * @name stmGameClimber.directive:stmGameClimberScreen
 * @function
 *
 * @requires stmGameClimber.directive:stmGameClimberScreen:b-gameClimber.css
 * @requires stmGameClimber.directive:stmGameClimberScreen:template.html
 *
 * @description
 * Экран игры Альпинист
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-game-climber-screen class="example-screen"></div>
      </file>
      <file name="style.css">
         .example-screen {
            width: 100%;
            height: 600px;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmGameClimber').directive('stmGameClimberScreen', function(){
    return {
        scope: {
          energy: '@energy',
          energyCSS: '@energyCSS',
          score: '@score'
        },
        templateUrl: 'partials/stmGameClimber.directive:stmGameClimberScreen:template.html',
        compile: function(tElement){
            return function(scope, iElement){

scope.score = 100;

function init() {

var g_pipeEl = $('.b-gameClimber'),
    g_viewEl = $('body,html');;

var keyObj = $('.l-html').is('.ie8') ? document : window,
  manualEl = $('.js-manual');

var manEl = g_pipeEl.find('.gameClimber-player'),
state = 0,
action = 'stop',
canBreakDown,
isUpPressed = false,
manualTimeout,
moveInterval,

attempts = 5 + Math.round(Math.random() * 5),

windowEl = $(window),
isFirst = true,
moveInterval,
doDownTimeout,
infoTimeout,
inScroll = false,

startPosition = parseInt(manEl.css('bottom')),
endPosition = g_pipeEl.height(),
spacePosition = endPosition * 0.7,
capPosition = endPosition * 0.35,
position = startPosition,
downPosition,
downPositionStop,
fromPosition,

blockUpEvents = {
    'keydown': function(e){
        if(e.keyCode == 38){
            e.preventDefault();                       
        }                    
    }           
},
keyEvents = {
    'keydown': function(e){
        if(e.keyCode == 38){
            e.preventDefault();                       
            if(action == 'down' && !canBreakDown) return;
            if(!isUpPressed) _up();
            isUpPressed = true;
            
            var ratio = (position - startPosition) / (endPosition - startPosition),
                step = 400;
            if(ratio>0.75) {   
                step = 180;        
            } else if(ratio>0.60) {
                step = 200;
            } else if(ratio>0.30) {
                step = 300;
            }                        
            
            _down(step, true);                        
        }                    
    },
    'keyup': function(e){
        if(e.keyCode == 38){
            isUpPressed = false;
            e.preventDefault();
        }
    }
};


function _up(){
    _stop();
    var step = 30,
        ratio = (position - startPosition) / (endPosition - startPosition);
    
    if(ratio>0.75) {
        step = 2.5;
    } else if(ratio>0.50) {
        step = 5;
    } else if(ratio>0.30) {
        step = 7.5;
    } else if(ratio>0.20) {
        step = 15;
    }
    
    position += step;
    
    // if(ratio > 0.5 ) _showInfo();
    clearTimeout(manualTimeout);
    // if(ratio > 0.07 && manualEl.is(':visible')) {
    //     manualEl.fadeOut();
    // }
    
    
    // if(ratio > 0.80) _showMeteor();
    // if(ratio > 0.53) _showAircraft();            
    
    _update();
    
    // if(Stm.env.isPromo) _checkSkidka();
    // else _checkLevel();
    
    action = 'up';
}

function _down(timeout, _canBreakDown) {
  clearTimeout(doDownTimeout);
  if(timeout) {
      doDownTimeout = setTimeout(function(){
          _down(null, _canBreakDown);
      }, timeout);
      return;
  }           
  _stop();
  canBreakDown = _canBreakDown;
  fromPosition = position;
  moveInterval = setInterval(function(){
      position -= 8;
      if(!canBreakDown && downPositionStop > position) {
          canBreakDown = true;
          _updateDownPosition();
      }
      _update();
  }, 10);                 
  action = 'down';
}

function _stop(){
    canBreakDown = false;
    clearInterval(moveInterval);
    action = 'stop';
}

function _showInfo(isNow){

}

function _update(){
            
    position = Math.min(Math.max(startPosition, position), endPosition);
    
    var newstate;

    // TODO
    // if(action == 'up' || action == 'stop') {
    //     if(position < capPosition) {
    //         newstate = (position % 60) > 30 ? 10 : 11;
    //         if(position > capPosition * 0.5) newstate += 2;
    //     } else { 
    //         if(position > capPosition) newstate = (position % 60) > 30 ? 2 : 3;
    //         if(position > spacePosition ) newstate += 4; 
    //     }
    // } else if( action == 'down') {
    //     newstate = fromPosition > spacePosition ? 8 : ( fromPosition > capPosition ? 4: 15 );
    // }
    
    // if (position == startPosition) newstate = action == 'down' ? (fromPosition > 200 ? 
    //     (fromPosition > spacePosition ? 9 : ( fromPosition > capPosition ? 5 : 14 ) )
    // : 1) : 1;
    // else if(position == endPosition) newstate = 7;
    
    if(action == 'up' || action == 'stop') {
      // console.log(fromPosition, position);
        // if(position < capPosition) {
            // newstate = (position % 60) > 30 ? 1 : 2;
            // if(position > capPosition * 0.5) newstate += 2;
        // } else { 
            // if(position > capPosition) newstate = (position % 60) > 30 ? 2 : 3;
            // if(position > spacePosition ) newstate += 4; 
        // }
        if(state < 10) {
          newstate = state + 1;
        } else {
          newstate = 1;
        }        
    } else if( action == 'down') {
        newstate = fromPosition > spacePosition ? 8 : ( fromPosition > capPosition ? 4: 15 );
    }
    
    // if (position == startPosition) newstate = action == 'down' ? (fromPosition > 200 ? 
    //     (fromPosition > spacePosition ? 9 : ( fromPosition > capPosition ? 5 : 14 ) )
    // : 1) : 1;
    // else if(position == endPosition) newstate = 7;


    if(state != newstate) {
        manEl
            .removeClass('mod_frame'+state)
            .addClass('mod_frame'+newstate);
        state = newstate;
    }    
    
    manEl
        .css({
            'bottom': action == 'down' || position == endPosition ? position : Math.max(startPosition, Math.floor(position / 30) * 30 - 30)
        });
    
    _setScroll();
    
    var ratio = (position - startPosition) / (endPosition - startPosition);
    
    // if(ratio > 0.4 ) _showInfo();
    // else _hideInfo();
    
    if( attempts>0 && downPosition < position) {
        attempts--;
        setTimeout(function(){
            _down();
        }, 0);
        return;
    }
    
    if(position == startPosition || position == endPosition) {
        if(action == 'down') {
            if( position == startPosition && state != 1) {
                // if( (Stm.env.isPromo && skidka > 0) || ( (!Stm.env.isPromo) && level > 0) ){
                //     setTimeout(function(){
                //         if(Stm.env.isPromo) {
                //             new Stm.popup.Promo({skidka: skidka}).open();                   
                //         } else {
                //             new Stm.popup.Promo({
                //                 level: level,
                //                 isFinal: g_levels.length <= level ,
                //                 levelText: g_levels[level-1]
                //             }).open();
                //         }
                //     }, 500);
                // } else {
                //     g_gamePopupEl
                //         .find('.js-button').text('Ещё попытка').end()
                //         .fadeIn();
                        
                //     Stm.post('ga', 'trackEvent', gaName, 'Fail');
                    
                // }
                $(keyObj)
                        .on(blockUpEvents)
                        .off(keyEvents);                        
            }
        }
        _stop();
        // _hideInfo();
        if(position == endPosition){
            setTimeout(function(){
                $(keyObj)
                    .off(keyEvents)
                    .on(blockUpEvents);
                clearTimeout(doDownTimeout);                    
            },0);
            setTimeout(function(){
                
                handEl.animate({
                    'height': 593
                }, 1000, 'linear', function(){
                    manEl.hide();
                    handEl.toggleClass('state_down state_up');
                    handEl.slideUp(1000, 'linear');
                });                   
            }, 500);
                               
            // setTimeout(function(){
            //     if(Stm.env.isPromo) {
            //         new Stm.popup.Promo().open();
            //     } else {
            //         new Stm.popup.Promo({
            //             isFinal: true,
            //             level: g_levels.length,
            //             levelText: g_levels[g_levels.length - 1]
            //         }).open();
            //     }                        
            // }, 2500 + 1500);
            
            // Stm.post('ga', 'trackEvent', gaName, 'Success');
        }
    }
}


function _setScroll(){
    
    if(position == endPosition) {
         g_viewEl.stop().animate({
            scrollTop: 200
        }, 200);
        return;
    }
    
    if(inScroll) return;

    var windowHeight = $(window).height(),
        scrollTo;
    
    if( action == 'down' ) {
        scrollTo = manEl.offset().top - (windowHeight - manEl.height()) / 3;
    } else {
        scrollTo = manEl.offset().top - (windowHeight - manEl.height());                
        scrollTo = scrollTo > $(document).height() - 1.5 * windowHeight ? $(document).height() - windowHeight : scrollTo;
    }
    
    if(Math.abs( scrollTo - $(window).scrollTop()) > windowHeight / 4 ) {
        g_viewEl.stop();
        inScroll = true;
        g_viewEl.animate({
            scrollTop: scrollTo
        }, 200, null, function(){
            inScroll = false;
        });
    }

}

$(keyObj)
    .off(keyEvents)
    .off(blockUpEvents)
    .on(keyEvents);

  g_viewEl.animate({ scrollTop: $(document).height() - $(window).height()});

}

$( document ).ready(function() {
  init();
});



            };
        }
    };
});
