/**
 * 
 * @requires stm
 *
 * @ngdoc overview
 * @name stmIndex
 * @description
 *
 * Модуль главной страницы
 */

angular.module('stmIndex', ['stm'])
    .config([function(){
    }])
    .run(['$rootScope', '$stmAuth', function($rootScope, $stmAuth){
        $rootScope.$on('gameInit', auth);
            
        function auth(){
            if(!$stmAuth.isAuth) $stmAuth.auth();
        }         
    }])
    /**
     * @ngdoc interface
     * @name stmIndex.Game
     * @description
     *
     * Внешний интерфейс игры
     * 
     */
    /**
       * @ngdoc method
       * @name stmIndex.Game#save
       * @methodOf stmIndex.Game
       *
       * @description
       * Сохраняет данные о прохождении игры
       *
       * @param {Object} params Данные игры:
       *
       *   - **`type`** – {String} – Тип игры
       *   - **`action`** – {String} – Действие в игре   
       *   - **`data`** – {Object} – Сведения о действии в игре
       */         
    .factory('Game', ['$resource', '$stmEnv', function($resource, $stmEnv){
        return $resource('api/game.php');
    }])
    /**
     * @ngdoc service
     * @name stmIndex.$stmAuth
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
       * @name stmIndex.$stmAuth#isAuth
       * @methodOf stmIndex.$stmAuth
       *
       * @returns {Boolean=} isAuth Авторизарован ли пользователь
       */         
    .factory('$stmAuth', ['$stmEnv', '$location', function($stmEnv, $location){
        
        var $ = angular.element;
        
        var disableEl = $('<a href="https://loginza.ru/api/widget?token_url=' + encodeURIComponent($('base').get(0).href + 'api/auth.php') + '"></a>')
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
            data: authData,
            isAuth: !!authData,
            auth: auth
        };
        
        return $stmAuth;
        
        function auth(clbFn){
            if(!window.LOGINZA){
                $.getScript('http://loginza.ru/js/widget.js', function(){
                    $('<style>#loginza_auth_form{z-index: 999999!important;}</style>').appendTo('head');
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
        function showLoginza(clbFn){
            LOGINZA.callback = function(token){
                onAuth(token);
                loginzaCloseFn.call(LOGINZA);
                if(clbFn) clbFn();                
            }
            LOGINZA.show.call(disableEl.get(0));
        }
        function onAuth(token){
            $stmAuth.isAuth = true;
            $stmAuth.data = window['_' + token];        
        }
    }]);

