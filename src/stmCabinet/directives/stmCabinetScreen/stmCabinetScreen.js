"use strict";
/**
 * @ngdoc directive
 * @name stmCabinet.directive:stmCabinetScreen
 * @function
 *
 * @requires stmCabinet.directive:stmCabinetScreen:b-cabinet.css
 * @requires stmCabinet.directive:stmCabinetScreen:template.html
 *
 * @requires stmIndex.directive:stmIndexToolbar
 * @requires stmIndex.directive:stmIndexAchiev
 * @requires stmIndex.$stmAchievs
 * @requires stmIndex.directive:stmIndexAchievsInfo
 *
 * @description
 * Экран личного кабинета
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
         <div stm-cabinet-screen class="example-screen"></div>
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
            overflow: auto;
            position: relative;
            }
      </file>
    </example>
    
 */

angular.module('stmCabinet').directive('stmCabinetScreen', function(){
    
     var GAME_TITLES = {
        'biathlon': 'Биатлон',
        'yeti': 'Фотоохота на Йети',
        'climber': 'Альпинист'
     };
    
     var $$ = angular;
    
     return {
         templateUrl: 'partials/stmCabinet.directive:stmCabinetScreen:template.html',
         controller: ['$scope', '$stmAuth', '$location', '$stmEnv', '$stmAchievs', function($scope, $stmAuth, $location, $stmEnv, $stmAchievs){
            $scope.logout = function(){
                $stmAuth.logout();
            }

            var games = $stmEnv.games;
            var game;
            var gamesArr = [];
            var score = 0;
            var achievCount = 0;
            var achievs;
            
            for(var gameType in games){
                game = games[gameType];
                achievs = $$.copy($stmAchievs[gameType]);
                for(var i=0;i<achievs.length;i++){
                    achievs[i].active = game.achievements.indexOf(achievs[i].type) >= 0;
                }
                gamesArr.push(game);
                game.type = gameType;
                game.achievs = achievs;
                game.title = GAME_TITLES[gameType];
                score += game.score;
                achievCount += game.achievements.length;
            }
            
            $scope.score = score;
            $scope.games = gamesArr;
            $scope.achievCount = achievCount;
            $scope.friends = $stmEnv.friends > 99 ? '99+' : $stmEnv.friends;
            $scope.products = $stmEnv.products;
            
            
            $scope.authData = $stmAuth.data;
            $scope.getName = function(){
                var name = $stmAuth.data.name;
                if(!name) return '';
                name = name.split(" ");
                return name[0] + " " + name[1][0] + ".";
            }            
         }]
     };
 });
