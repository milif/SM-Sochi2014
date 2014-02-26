<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Cache.class.php';

class User {
    static public function getFriendsCount(){
        if(CLIENT_ID == 0) return 0;
        $key = 'friends.'.CLIENT_ID;
        $counter = Cache::get();
        if($counter !== false) return (int)$counter;
        
        $rs = DB::query("SELECT COUNT(*) as count FROM `user` WHERE ref_id = ".CLIENT_ID);
        $count = $rs[0]['count'];
        Cache::set($key, $count, 1200);
        return (int)$count;
    }    
}
