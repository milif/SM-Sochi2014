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
    var $$ = angular;
    return {
        scope: true,
        templateUrl: 'partials/stmIndex.directive:stmIndexQuiz:template.html',
        controller: ['$scope', '$attrs', '$timeout', '$interval', 'stmQuiz', function($scope, $attrs, $timeout, $interval, stmQuiz){
            
            var cancelQuizTimer;
            var endTime;
            
            var model = $scope.model = {};
            var answers;
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
                prepareRadio();
                model.answer = null;
            };
            var quiz = $scope.quiz = $scope.$eval($attrs.stmIndexQuiz);
            var questions = $$.copy(quiz);
            quiz.splice(0, quiz.length - 3);
            
            $scope.$on('$destroy', function() {
                $interval.cancel(cancelQuizTimer);
            });            
            function prepareRadio(){
                var question = quiz[$scope.index];
                if(question.type == 'radio'){
                    if(!question._answer){
                        question._answer = $$.copy(question.answer);
                        question._correct = question._answer.splice(0,1)[0];
                    }
                    question.answer = [];
                    shuffle(question._answer);
                    for(var i=0;i<Math.min(4, question._answer.length);i++){
                        question.answer.push(question._answer[i]);
                    }
                    question.answer.splice(Math.floor(Math.random() * question.answer.length), 0, question._correct);
                }                
            }
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
                answers = {};
                quiz.splice(0, quiz.length);
                shuffle(questions);
                for(var i=0;i<3;i++){
                    quiz.push(questions[i]);
                }
                $scope.index = 0;
                prepareRadio();
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
            function shuffle(o){ //v1.0
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){};
                return o;
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
