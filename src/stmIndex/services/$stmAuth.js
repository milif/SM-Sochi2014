"use strict";
    /**
     * @ngdoc service
     * @name stmIndex.$stmAuth
     *
     * @description
     *
     * Сервис авторизации
     * 
     */
     /**
       * @ngdoc method
       * @name stmIndex.$stmAuth#auth
       * @methodOf stmIndex.$stmAuth
       *
       * @description
       * Выполняет процедуру авторизации
       *
       * @param {Function=} clbFn Вызывается по окончанию авторизации
       */    
     /**
       * @ngdoc property
       * @name stmIndex.$stmAuth#auth
       * @propertyOf stmIndex.$stmAuth
       * @returns {Object} Данные авторизации. Если пользователь не авторизован, то `null`
       */        
     /**
       * @ngdoc property
       * @name stmIndex.$stmAuth#isAuth
       * @propertyOf stmIndex.$stmAuth
       *
       * @returns {Boolean} Авторизарован ли пользователь
       */         
    angular.module('stmIndex').factory('$stmAuth', ['$stmEnv', '$location', '$http', '$rootScope', function($stmEnv, $location, $http, $rootScope){
        
        var $$ = angular;
        var $ = angular.element;
        
        var disableEl = $('<a href="https://loginza.ru/api/widget?token_url=' + encodeURIComponent($('base').get(0).href + 'api/auth.php') + '&providers_set=vkontakte,facebook,google,odnoklassniki,twitter,mailruapi,yandex,linkedin,livejournal,openid,mailru,myopenid,webmoney, rambler,flickr,lastfm,verisign,aol,steam"></a>')
                .click(function(e){
                    e.preventDefault();
                })
                .css({
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 99999,
                    cursor: 'default'
                });
    
        var authData = $stmEnv.auth;
    
        var $stmAuth = {
            data: authData || {},
            isAuth: !!authData,
            auth: auth,
            logout: logout
        };
        
        return $stmAuth;
        
        function auth(clbFn){
            if(!window.LOGINZA){
                $.getScript('http://loginza.ru/js/widget.js', function(){
                    $('<style>#loginza_auth_form{z-index: 999999!important;} #loginza_auth_form > *:first-child{display:none!important;}</style>').appendTo('head');
                    setTimeout(function(){
                        LOGINZA.ajax = true;
                        var loginzaCloseFn = LOGINZA.close;
                        $.extend(LOGINZA, {
                            'ajax': true,
                            'close': function(){
                                if(!$stmAuth.isAuth) return;
                                loginzaCloseFn.call(LOGINZA);
                                disableEl.remove();
                            }                           
                        });
                        showLoginza(clbFn);
                    }, 50);
                });
            } else {
                showLoginza(clbFn);
            }
            disableEl.appendTo('body');         
        }
        function logout(){
            $http.post('api/auth.php?logout=1').then(function(){
                window.location.reload();
            });
        }
        function showLoginza(clbFn){
            LOGINZA.callback = function(token){
                onAuth(token, clbFn);             
            }
            LOGINZA.show.call(disableEl.get(0));
        }
        function onAuth(token, clbFn){
            $rootScope.$apply(function(){
                $stmAuth.isAuth = true;
                $$.extend($stmAuth.data, window['_' + token]);             
                LOGINZA.close();
                if(clbFn) clbFn();
            });    
        }
    }]);
