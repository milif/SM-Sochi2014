"use strict";
/**
 * 
 * @requires stm
 * @requires stm.$md5
 * @requires stm.filter:stmNumber
 * @requires angularui/ui-utils.js
 *
 * @includes stmIndex.$stmAuth
 * @includes stmIndex:regform.html
 * @includes stmIndex:code.html
 * @includes stmIndex.directive:stmIndexPopup
 * @includes stmIndex.directive:stmIndexForm 
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
    .run(['$rootScope', '$stmAuth', '$http', '$md5', '$stmEnv', '$compile', '$timeout', 'User', '$templateCache', '$location', function($rootScope, $stmAuth, $http, $md5, $stmEnv, $compile, $timeout, User, $templateCache, $location){
    
        var $$ = angular;
        var $ = angular.element;
    
        var isLoaded = false;
    
        $rootScope.$on('gameInit', auth);
        $rootScope.$on('loaded', function(){
            isLoaded = true;
            if($stmAuth.isAuth && !$stmAuth.data.isReg) {
                showRegForm();
            }            
        });
        
        $rootScope.$on('$locationChangeSuccess', function(){
            if($stmAuth.isAuth && $location.hash() == 'code' && /(\/map\/|\/account\/)/.test($location.url())){
                showCodeForm();
            }
        });
        
        function auth(){
            if(!$stmAuth.isAuth) {
                $stmAuth.auth(function(){
                    $rootScope.$emit('auth');
                    if(!$stmAuth.data.isReg) showRegForm();
                });
            }
        }  
        function showCodeForm(){
            if(!isLoaded) {
                $timeout(showCodeForm, 500);
                return;
            }
            var $codeScope = $rootScope.$new();
            
            $codeScope.$on('closeCode', function(){
                $codeScope.$broadcast('closePopup-code');
            });
            
            $http.get('partials/stmIndex:code.html', {cache: $templateCache}).success(function(template) {
                $compile(template)($codeScope, function(el){
                    $('body').append(el);
                }); 
            });

            $codeScope.isShow = true;
            $codeScope.closeCode = function(){
                $location.hash('.');
                $codeScope.$destroy();
            };
        }
        function showRegForm(){
            var model = $stmAuth.data;
            model.confirm = true;
            var $formScope = $rootScope.$new();
            $formScope.model = model;
            var form = $formScope.formCfg = {
                model: model,
                fields: [
                    {
                        type: 'text',
                        label: 'Фамилия, Имя и Отчество',
                        placeholder: 'Ф.И.О.',
                        name: 'name',
                        required: true,
                        pattern: /^[a-яa-z]{2,}\s+[a-яa-z]+/i
                    },
                    {
                        type: 'email',
                        label: 'Электронная почта',
                        name: 'email',
                        required: true
                    },
                    {
                        type: 'phone',
                        label: 'Номер телефона',
                        name: 'phone'
                    },
                    [
                        {
                            type: 'date',
                            label: 'Дата рождения',
                            name: 'dob',
                            required: true,
                            size: '3-8'
                        },
                        {
                            type: 'switch',
                            label: 'Пол',
                            name: 'gender',
                            required: true,
                            values: [['Мужской', 'male'], ['Женский', 'female']],
                            size: '5-8'
                        }                        
                    ]
                ]
            }
            
            $http.get('partials/stmIndex:regform.html', {cache: $templateCache}).success(function(template) {
                $compile(template)($formScope, function(el){
                    $('body').append(el);
                }); 
            });

            $formScope.isShow = true;
            $formScope.submit = function(){
                if(form.validate() && !$formScope.isSend) {
                    $formScope.isSend = true;
                    var res = User.save(model, function(){
                        if(!res.success) {
                            return;
                        }
                        $formScope.isShow = false;                
                    });
                    res.$promise.finally(function(){
                        $formScope.isSend = false;
                    });
                }
            }
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
        
        // Counters
        if($stmEnv.isProduction){
            initYandexMetrica();
            initLiveInternet(); 
        }
               
        function initYandexMetrica(){
            var d = document,
                w = window;
            
            w.yaParams = {};
            //Yandex.Metrika
            var c = 'yandex_metrika_callbacks';
            (w[c] = w[c] || []).push(function() {
                try {
                    w.yaCounter20030233 = new Ya.Metrika({
                        id:20030233,
                        webvisor:true,
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        trackHash:true,
                        ut:"noindex",
                        params:w.yaParams||{}
                    });
                } catch(e) { }
            });

            var n = d.getElementsByTagName("script")[0],
                s = d.createElement("script"),
                f = function () { n.parentNode.insertBefore(s, n); };
            s.type = "text/javascript";
            s.async = true;
            s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

            if (w.opera == "[object Opera]") {
                d.addEventListener("DOMContentLoaded", f, false);
            } else { f(); }
            
        }
        function initLiveInternet(){
            setTimeout(function(){ 
                $('body').append('<img src="' + (("https:" == document.location.protocol) ? "https" : "http") + '://counter.yadro.ru/hit?t14.3;r'+
                escape(document.referrer)+((typeof(screen)=='undefined')?'':
                ';s'+screen.width+'*'+screen.height+'*'+(screen.colorDepth?
                screen.colorDepth:screen.pixelDepth))+';u'+escape(document.URL)+
                ';'+Math.random()+
                '" '+
                'border=0 width=1 height=1 style="position:absolute;top:0;">');
            }, 500);
        }             
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
        var Game = $resource('api/game.php');
        var saveMethod = Game.save;
        var uid;
        Game.save = function(params){
            if(params.action == 'start') {
                uid = new Date().getTime();
            }
            params.uid = uid;
            return saveMethod.apply(this, arguments);
        }
        return Game;
    }])
    /**
     * @ngdoc interface
     * @name stmIndex.User
     * @description
     *
     * Внешний интерфейс пользователя
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.User#save
       * @methodOf stmIndex.User
       *
       * @description
       * Сохраняет данные о пользователе
       *
       * @param {Object} params Данные пользователя
       *            
       */    
    .factory('User', ['$resource', '$stmEnv', function($resource, $stmEnv){
        return $resource('api/user.php');
    }]);;

