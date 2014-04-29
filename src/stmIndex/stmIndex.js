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
 * @includes stmIndex:confirmemail.html
 * @includes stmIndex:code.html
 * @includes stmIndex:askgoods.html
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
    .run(['$rootScope', '$stmAuth', '$http', '$md5', '$stmEnv', '$compile', '$timeout', 'User', '$templateCache', '$location', '$q', function($rootScope, $stmAuth, $http, $md5, $stmEnv, $compile, $timeout, User, $templateCache, $location, $q){
    
        var $$ = angular;
        var $ = angular.element;
    
        var isLoaded = false;
        var isAskGoods = false;
 
        $rootScope.$on('gameInit', auth);
        $rootScope.$on('showConfirmPopup', function(e, action){
            showConfirmEmail(action);
        });
        $rootScope.$on('loaded', function(){
            isLoaded = true;
            if($stmAuth.isAuth && !$stmAuth.data.isReg) {
                showRegForm();
            } 
            if($stmAuth.isAuth && $stmEnv.requireConfirm && !/confirmation/.test($location.url())) {
                var time = parseInt(localStorage.getItem('_stmSochiConfirmTime') || 0);
                var curTime = new Date().getTime();
                if(time < curTime) {
                    showConfirmEmail();
                    localStorage.setItem('_stmSochiConfirmTime', curTime + 86400000);
                }
            }
            if($stmAuth.isAuth) {
                var time = parseInt(localStorage.getItem('_stmSochiAskGoodsTime') || 0);
                var curTime = new Date().getTime();
                if(time < curTime) {
                    showAskGoods();
                    localStorage.setItem('_stmSochiAskGoodsTime', curTime + 86400000);
                }
            }         
        });
        
        $rootScope.$on('$locationChangeSuccess', function(){
            if($stmAuth.isAuth && $location.hash() == 'code' && /(\/map\/|\/account\/)/.test($location.url())){
                showCodeForm();
            }
            if($location.hash() == 'sochivote' && /(\/map\/|\/sale\/|\/|\/price\/)/.test($location.url())){
                showAskGoods(true);
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
        var apiAskGoods = 'api/votegoods.php';
        function showAskGoods(forceShow){
            if(isAskGoods) return;
            if(!isLoaded) {
                $timeout(function(){
                    showAskGoods(forceShow);
                }, 500);
                return;
            }
            isAskGoods = true;
            var $scope = $rootScope.$new();
            var data;
            var groups;
            var currentGroup;
            var votedGroup;
            var model;
            
            $scope.bestVotes = 1;
            
            $q.all([
                $http.get('partials/stmIndex:askgoods.html', {cache: $templateCache}),
                $http.post(apiAskGoods, {action: 'get'})
            ]).then(function(results){
                data = $scope.data = results[1].data;
                groups = $scope.groups = [];
                var subName;
                var item;
                votedGroup = [];
                for(var i=0;i<data.items.length;i++){
                    item = data.items[i];
                    data['item'+item.id] = item;
                    subName = item.subName;
                    if(groups.indexOf(subName) < 0) groups.push(subName);
                    if(data.voted.indexOf(item.id) >= 0) {
                        item.votes--;
                        addVoted(item);
                    }
                    $scope.bestVotes = Math.max($scope.bestVotes, item.votes);
                }

                $scope.isLast = groups.length - votedGroup.length == 1;
                $scope.isSelected = $scope.isComplete = votedGroup.length == groups.length;

                if(!forceShow && $scope.isComplete){
                    $scope.$destroy();
                    return;
                }
                
                next();
                
                var template = results[0].data;
                $compile(template)($scope, function(el){
                    $('body').append(el);
                });
            });
            
            $scope.closeAskGoods = function(){
                if($location.hash() == 'sochivote') $location.hash('.');
                $scope.$destroy();
                isAskGoods = false;
            };
            $scope.tab = tab;
            $scope.next = function(){
                $timeout(next, 0);
            }
            $scope.select = function(){
                $timeout(select, 0);
            }
            $scope.isVoted = isVoted;
            
            function select(){
                if(!model.item) return;
                addVoted(data['item' + model.item]);
                $http.post(apiAskGoods, {action: 'vote', id: model.item});
                //if(!$scope.isComplete) next();
            }
            function isVoted(group){
                return votedGroup.indexOf(group) >= 0;
            }
            function addVoted(item){
                var group = item.subName;
                if(votedGroup.indexOf(group) >= 0) return;
                votedGroup.push(group);
                item.votes += 1;
                item.selected = true;
                $scope.isLast = groups.length - votedGroup.length == 1;
                $scope.isComplete = votedGroup.length == groups.length;
                $scope.isSelected = true;
                $scope.bestVotes = Math.max($scope.bestVotes, item.votes);
            }
            function tab(group){
                $scope.currentGroup = currentGroup = group;
                
            }
            function next(){
                model = $scope.model = {};
                var currentInd = groups.indexOf(currentGroup);
                while(true){
                    currentInd = (currentInd + 1) % groups.length;
                    if(votedGroup.indexOf(groups[currentInd]) < 0 || $scope.isComplete){
                        tab(groups[currentInd]);
                        break;
                    }
                }
            }
        } 
        var apiConfirmEmail = 'api/confirmemail.php';
        function showConfirmEmail(action){

            var $scope = $rootScope.$new();
            var model = $scope.model = {};
            $scope.closeConfirm = function(){
                $scope.$destroy();
            };
            
            $scope.send = function(){
                $timeout(send, 0);
            };
            $scope.start = function(){
                $timeout(start, 0);
            };
            $scope.changeEmail = function(){
                $timeout(email, 0);
            }
                       
            $scope.submit = function(){
                var form = model.form;
                if(!$scope.isSend && form.$valid) {
                    $scope.isSend = true;
                    var email = model.email;
                    var res = $http.post(apiConfirmEmail, {
                        send: true,
                        email: email
                    });
                    res.success(function(data){
                        if(data.success){
                            $scope.state = 'send';
                            $stmAuth.data.email = email;
                        }
                    });
                    res.finally(function(){
                        $scope.isSend = false;
                    });
                }
            }            
            
            start();
            
            if(action == 'send') {
                send();
            }
            
            $http.get('partials/stmIndex:confirmemail.html', {cache: $templateCache}).success(function(template) {
                $compile(template)($scope, function(el){
                    $('body').append(el);
                }); 
            });
            function start(){
                $scope.state = "start";
                model.email = $stmAuth.data.email;
            }
            function send(){
                $scope.state = 'send';
                $http.post(apiConfirmEmail, {
                    send: true
                });
            }
            function email(){
                model.email = '';
                $scope.state = "email";
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
            var model = $$.copy($stmAuth.data);
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
            $formScope.closeRegForm = function(){
                $formScope.isShow = false;
            }            
            $formScope.submit = function(){
                if(form.validate() && !$formScope.isSend) {
                    $formScope.isSend = true;
                    var res = User.save(model, function(){
                        if(!res.success) {
                            return;
                        }
                        $$.extend($stmAuth.data, model);
                        $formScope.$broadcast('closePopup-regform');                
                    });
                    res.$promise.finally(function(){
                        $formScope.isSend = false;
                    });
                }
            }
        }
                            
        // Simple signature implementation
        $http.defaults.transformRequest = [function(data, headers){
            if(!data) return JSON.stringify(data);
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

