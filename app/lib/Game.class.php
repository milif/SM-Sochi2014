<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Achiev.class.php';

class Game {
    static $types = array('biathlon', 'yeti', 'climber');
    static public function save($data){
        if(CLIENT_ID == 0) return false;
        $type = $data['type'];
        $score = $data['score'];
        $jsonData = json_encode($data['data']);
        DB::query("INSERT INTO game_log (user_id, type, action, score, data) VALUES (".CLIENT_ID.", :type, :action, :score, :data)", array(':type'=> $type, ':action'=>$data['action'], ':score' => $score, ':data'=> $jsonData));
        
        if($data['action'] != 'end') return;
        
        if($type == 'climber' && $data['data']['final']){
            DB::query("UPDATE `user` SET climber_passed = climber_passed + 1 WHERE id = ".CLIENT_ID);
            $rs = DB::query("SELECT climber_passed FROM `user` WHERE id = ".CLIENT_ID);
            if($rs[0]['climber_passed'] == 10 ) {
                Achiev::add('climber.kingofhill');
            }
        }
        
        $rs = DB::query("SELECT id FROM `user` WHERE score_game_$type <= :score AND id = ".CLIENT_ID, array(':score' => $score));
        if(count($rs)){
            DB::query("UPDATE `user` SET score_game_$type = :score, data_game_$type = :data WHERE id = ".CLIENT_ID, array(':score' => $score, ':data'=> $jsonData));
        }
        return self::getUserData($type);
    }
    static public function getUserData($type = null){
        if(!$type) {
            $types = array();
            foreach(self::$types as $type){
                $types[$type] = self::getUserData($type);
            }
            return $types;
        }
        $rs = DB::query("SELECT data_game_$type, data_achievement_$type, score_game_$type FROM `user` WHERE id = ".CLIENT_ID);
        if(!count($rs)) return array();
        $row = $rs[0];
        return array(
            'data' => json_decode($row['data_game_'.$type], true),
            'score' => (int)$row['score_game_'.$type],
            'achievements' => $row['data_achievement_'.$type] == "" ? array() : explode(',', str_replace("$type.", '', $row['data_achievement_'.$type]))
        );
    }
    static public function getClimberPassed(){
        $rs = DB::query("SELECT climber_passed FROM `user` WHERE id = ".CLIENT_ID);
        return is_array($rs) ? (int)$rs[0]['climber_passed'] : 0;
    }    
}
