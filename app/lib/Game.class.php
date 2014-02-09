<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';

class Game {
    static public function save($data){
        if(CLIENT_ID == 0) return false;
        DB::query("INSERT INTO game_log (user_id, type, action, data) VALUES (".CLIENT_ID.", :type, :action, :data)", array(':type'=>$data['type'], ':action'=>$data['action'], ':data'=> json_encode($data['data']) ));
        return true;
    }
}
