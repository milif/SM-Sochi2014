<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';

class Mnogo {
    static public function add($code){
    
        if(CLIENT_ID == 0 || !preg_match('/\d{8}/', $code)) return false;
        
        DB::query("DELETE FROM mnogo_card WHERE user_id = ".CLIENT_ID);        
        DB::query("INSERT INTO mnogo_card (user_id, code) VALUES (".CLIENT_ID.", :code);", array(":code" => $code));
        
        return true;
    }
    static public function has(){
        $rs = DB::query("SELECT id FROM mnogo_card WHERE user_id = ".CLIENT_ID);
        return count($rs) > 0;
    }
}
