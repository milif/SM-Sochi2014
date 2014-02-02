/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexSocial
 * @function
 *
 * @requires stmIndex.directive:stmIndexSocial:b-social.css
 * @requires stmIndex.directive:stmIndexSocial:template.html
 * 
 * @description
 * Панель соц. кнопок
 *
 * @element ANY
 * @param {Integer} buttons-count Число кнопок на панели
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div  stm-index-social class="example-screen"></div>
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
            overflow: scroll;
            }
      </file>
    </example>
    
 */

angular.module('stmIndex')
.directive('stmIndexSocial', ['Social', function(Social){
    var BUTTONS = [
        {
            type: 'vk',
            onClick: clickVK
        },
        {
            type: 'fb',
            onClick: clickFB
        },
        {
            type: 'tw',
            onClick: clickTW
        },
        {
            type: 'gp',
            onClick: clickGP
        },
        {
            type: 'ok',
            onClick: clickOK
        }
    ]; 
    
    var $ = angular.element;
    
    var SHARE = {
        image: $('meta[property="og:image"]').attr('content'),
        title: $('meta[property="og:title"]').attr('content'),
        description: $('meta[property="og:description"]').attr('content')
    };
    var URL = $('base').attr('href');
    
    function clickVK(){
        shareWindow("http://vk.com/share.php?url="
                        +encodeURIComponent(URL)
                        +(SHARE.title ?
                        "&description="+encodeURIComponent(SHARE.description)+"&title="+encodeURIComponent(SHARE.title)
                        :
                        "&title="+encodeURIComponent(SHARE.description)
                        )
                        +"&image="+encodeURIComponent(SHARE.image.replace(/\.(png|jpg)$/, '_vk.$1')), 720, 550);
    }
    function clickFB(){
        shareWindow("http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(URL));
    }
    function clickTW(){
        shareWindow("https://twitter.com/intent/tweet?status=" + encodeURIComponent(SHARE.description + ' ' + URL) + "&url="+encodeURIComponent(URL));
    }
    function clickGP(){
        shareWindow("https://plus.google.com/share?url="+encodeURIComponent(URL)+"&t="+encodeURIComponent(SHARE.description));
    }
    function clickOK(){
        
    }   
    function shareWindow(url, width, height){
        var screenWidth = $(window).width(),
            screenHeight = $(window).height(),
            width = Math.min(screenWidth, width || 600),
            height = Math.min(screenHeight, height || 435),
            top = Math.floor((screenHeight-height)/2),
            left = Math.floor((screenWidth-width)/2);
  
        window.open(url, "share", "left="+left+",top="+top+",width="+width+",height="+height+",resizable=no,scrollbars=yes,status=yes");
    }    
    return {
        templateUrl: 'partials/stmIndex.directive:stmIndexSocial:template.html',
        controller: ['$attrs','$element','$scope', function($attrs, $element, $scope){
            $scope.socials = Social.get();
            $attrs.$observe('buttonsCount', function(buttonsCount){
                $scope.buttonsCount = $scope.$eval(buttonsCount) || $attrs.buttonsCount;
                var buttons = [];
                for(var i=0;i<buttonsCount;i++){
                    buttons.push(BUTTONS[i]);
                }
                $scope.buttons = buttons;
            });            
        }]
    };
}])
.factory('Social', ['$resource', function($resource){
    return $resource('api/socials.php');
}]);


