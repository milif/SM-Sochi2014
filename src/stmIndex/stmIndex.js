/**
 * 
 * @requires stm
 * @requires stm.$md5
 * @requires stm.filter:stmNumber
 * @requires angularui/ui-utils.js
 *
 * @ngdoc overview
 * @name stmIndex
 * @description
 *
 * Модуль главной страницы
 */
if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            setTimeout(callback, 10);
        };
}        
angular.module('stmIndex', ['stm', 'ui.utils'])
    .config([function(){
    }])
    .run(['$rootScope', '$stmAuth', '$http', '$md5', function($rootScope, $stmAuth, $http, $md5){
    
        var $$ = angular;
    
        $rootScope.$on('gameInit', auth);
        
        function auth(){
            if(!$stmAuth.isAuth) $stmAuth.auth();
        }         
                    
        // Simple signature implementation
        $http.defaults.transformRequest = [function(data, headers){
            if(!$stmAuth.isAuth || !data) return JSON.stringify(data);
            var time = Math.round(new Date().getTime() / 1000);
            if($$.isObject(data)) data = JSON.stringify(data);
            $$.extend(headers(),{
                'StmSignature': $md5(data + time + 'WEKTIF'),
                'StmSignatureTime': time
            });
            return data;
        }];           
                    
    }])
    /**
     * @ngdoc interface
     * @name stmIndex.Achiev
     * @description
     *
     * Внешний интерфейс достижений
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.Achiev#save
       * @methodOf stmIndex.Achiev
       *
       * @description
       * Сохраняет достижение в игре
       *
       * @param {Object} params Данные игры:
       *
       *   - **`key`** – {String} – Ключ достижения
       *            
       */         
    .factory('Achiev', ['$resource', function($resource){
        return $resource('api/achiev.php');
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
       * @name stmIndex.Game#get
       * @methodOf stmIndex.Game
       *
       * @description
       * Данные наилучшего прохождения
       *
       * @param {Object} params Параметры:
       *
       *   - **`type`** – {String} – Тип игры
       *
       * @returns {Resource} Данные прохождения
       *
       *       { 
       *        'score': {Integer}, // Очки
       *        'data':   {Object}, // Данные прохождения
       *        'achievement':  {Array} // Достижения
       *      }       
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
       *
       * @returns {Resource} Данные лучшего прохождения
       *            
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
    .factory('$stmAuth', ['$stmEnv', '$location', function($stmEnv, $location){
        
        var $ = angular.element;
        
        var disableEl = $('<a href="https://loginza.ru/api/widget?token_url=' + encodeURIComponent($('base').get(0).href + 'api/auth.php') + '"></a>')
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
            data: authData,
            isAuth: !!authData,
            auth: auth
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

