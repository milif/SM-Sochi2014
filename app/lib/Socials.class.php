<?php

require_once __DIR__.'/db.php';
require_once __DIR__.'/cache.php';

class Socials {
    static $TYPES = ['vk', 'fb', 'ok', 'gp', 'tw'];
    static public function get(){
        $counters = array();
        foreach(self::$TYPES as $type){
            $counters[$type] = self::getCounter($type);
        }
        return array('counters'=>$counters);
    }
    static public function getCounter($type){
        $counter = Cache::get('socials.'.$type);
        if($counter !== false) return $counter;
        
        $rs = DB::query("SELECT COUNT(*) as count FROM social_log WHERE type='".$type."'");
        $count = $rs[0]; 
        Cache::set('socials.'.$type, $count);
        return $count;
    }
    static public function add($type){
        $rs = DB::query("SELECT COUNT(*) FROM social_log WHERE type = '$type' AND clientId = ".CLIENT_ID."");
        if(count($rs)) return false;
        
        $count = Cache::increment('socials.'.$type);
        if($count === false){
            $count = self::getCounter($type) + 1;
            Cache::increment('socials.'.$type);
        }
        
        DB::query("INSERT INTO social_log (time, client_id, type) VALUES (NOW(), ".CLIENT_ID.", '$type');");
        return true;
    }
}
