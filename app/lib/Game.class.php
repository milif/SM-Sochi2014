<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';

class Game {
    static public function save($data){
        if(CLIENT_ID == 0) return false;
        DB::query("INSERT INTO game_log (user_id, type, action, data) VALUES (".CLIENT_ID.", :type, :action, :data)", array(':type'=>$data['type'], ':action'=>$data['action'], ':data'=> json_encode($data['data']) ));
        return true;
    }
    static public function getUserData($type){
        $rs = DB::query("SELECT data_game_climber, data_achievement_climber, score_game_climber FROM `user` WHERE id = ".CLIENT_ID);
        if(!count($rs)) return array();
        $row = $rs[0];
        return array(
            'data' => json_decode($row['data_game_climber'], true),
            'score' => $row['score_game_climber'],
            'achievement' => explode(',', str_replace("$type.", '', $row['data_achievement_climber']))
        );
    }
}
