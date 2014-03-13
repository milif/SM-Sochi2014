"use strict";
/**
 * @ngdoc directive
 * @name stmIndex.directive:stmIndexQuiz
 * @function
 *
 * @requires stmIndex.directive:stmIndexQuiz:b-quiz.css
 * @requires stmIndex.directive:stmIndexQuiz:template.html
 *
 * @requires stm.filter:stmHowMany
 *
 * @description
 * Викторина
 *
 * @element ANY
 *
 * @example
    <example module="appExample">
      <file name="index.html">
        <div class="b-sample">
            <div stm-index-quiz></div>
        </div>
      </file>
      <file name="style.css">
      .b-sample {
          height: 600px;
          overflow: auto;
      }
      </file>
    </example>
    
 */


angular.module('stmIndex').directive('stmIndexQuiz', function(){
    return {
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexQuiz:template.html',
        controller: ['$scope', '$attrs', '$timeout', '$interval', 'stmQuiz', function($scope, $attrs, $timeout, $interval, stmQuiz){
            
            var cancelQuizTimer;
            var endTime;
            
            var model = $scope.model = {};
            var answers = {};
            $scope.state = 'start';
            $scope.start = start;
            $scope.next = function(){
                $scope.$emit('quizNext', quiz);
            }
            $scope.answer = function(){
                if(!model.answer || model.answer == '') return;
                answers[quiz[$scope.index].id] = model.answer;
                if($scope.index++ == quiz.length - 1){
                    $scope.index--;
                    end();
                }
                model.answer = null;
            };
            var quiz = $scope.quiz = $scope.$eval($attrs.stmIndexQuiz);
            
            $scope.$on('$destroy', function() {
                $interval.cancel(cancelQuizTimer);
            });            
            
            function updateTime(){
                var time = $scope.time = Math.round(Math.max(0, endTime - new Date().getTime()) / 1000);
                $scope.m = Math.floor(time / 60);
                $scope.s = time - $scope.m * 60;  
                if(time == 0) {
                    $scope.checked = {};
                    $scope.state = 'end';
                    $scope.isTimeout = true;
                    $interval.cancel(cancelQuizTimer);
                };
            }
            function start(){
                $scope.index = 0;
                $scope.isTimeout = false;
                endTime = new Date().getTime() + quiz.achiev.time * 1000;
                updateTime();
                cancelQuizTimer = $interval(updateTime, 1000);
                $timeout(function(){
                    $scope.state = 'go';
                }, 0);
            }            
            function end(){
                $interval.cancel(cancelQuizTimer);
                if($scope.inCheck) return;
                $scope.inCheck = true;
                var checkedAnswers = stmQuiz.check(answers, function(){
                    $scope.state = 'end';
                    $scope.checked = checkedAnswers;
                    if(checkedAnswers.passed) {
                        quiz.achiev.add();
                    }
                });
                checkedAnswers.$promise.finally(function(){
                    $scope.inCheck = false;
                });                
            }
        }]
    };
    
})
    /**
     * @ngdoc interface
     * @name stmIndex.stmQuiz
     * @description
     *
     * Внешний интерфейс викторины
     * 
     */    
    /**
       * @ngdoc method
       * @name stmIndex.stmQuiz#check
       * @methodOf stmIndex.stmQuiz
       *
       * @description
       * Проверяет ответы на вопросы
       *
       * @param {Object} answers Ответы на вопросы
       *
       *            
       */         
    .factory('stmQuiz', ['$resource', function($resource){
        var stmQuiz = $resource('api/quiz.php');
        stmQuiz.check = function(answers, clbFn){
            return stmQuiz.save(answers, clbFn);
        };
        return stmQuiz;

    }]);
