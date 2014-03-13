<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Cache.class.php';

class Quiz {
    static public function getAll(){
        $rs = DB::query("SELECT id, quiz, `type`, question, answer, page FROM `quiz`;");
        $result = array();
        foreach($rs as $id => $row){
            if($row['type'] == 'radio') {
                $answer = explode(';', $row['answer']);
            } else {
                $answer = null;
            }
            
            $result[$row['quiz']][] = array(
                'id' => $row['id'],
                'quiz' => $row['quiz'],
                'type' => $row['type'],
                'question' => $row['question'],
                'answer' =>  $answer,
                'page' => $row['page']
            );
        }
        return $result;
    }    
    static public function check($answers){
        $ids = array_keys($answers);
        $i=0;
        $inQ = array();
        $bind = array();
        foreach($ids as $id){
            $key = ":id".($i++);
            $inQ[] = $key;
            $bind[$key] = $id;
        }
        $rs = DB::query("SELECT id, quiz, type, answer FROM `quiz` WHERE id IN (".implode(',',$inQ).");", $bind);
        $correct = array();
        $type = '';
        foreach($rs as $row){
            $type = $row['quiz'];
            $answer = explode(';', $row['answer']);
            if($row['type'] == 'radio') {
                if($answer[0] == $answers[$row['id']]){
                    $correct[] = $row['id'];
                }
            } elseif($row['type'] == 'text') {
                foreach($answer as $item){
                    if(mb_strtolower($item, 'UTF-8') == mb_strtolower($answers[$row['id']], 'UTF-8')){
                        $correct[] = $row['id'];
                        break;
                    };                    
                }                
            }
        }
        DB::query("INSERT INTO `quiz_log` (user_id, type, data, correct) VALUES (".CLIENT_ID.", '$type', :data, ".count($correct).");", array(':data' => json_encode($answers)));
        
        return $correct;
    }
    
}
