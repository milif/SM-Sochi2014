<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Cache.class.php';
require_once __DIR__.'/Auth.class.php';

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
        if($counter !== false) return (int)$counter;
        
        $rs = DB::query("SELECT COUNT(*) as count FROM social_log WHERE type = :type ", array(':type'=>$type));
        $count = $rs[0]['count'];
        Cache::set('socials.'.$type, $count);
        return (int)$count;
    }
    static public function add($type){
        $uid = CLIENT_ID > 0 ? CLIENT_ID : $_COOKIE['__stmuid'];
        $rs = DB::query("SELECT COUNT(*) as count FROM social_log WHERE type = :type AND uid = :uid", array(':type'=>$type, ':uid'=>$uid));
       
        if($rs[0]['count'] > 0) return false;
        
        $count = Cache::increment('socials.'.$type);
        if($count === false){
            $count = self::getCounter($type) + 1;
            Cache::increment('socials.'.$type);
        }
        
        DB::query("INSERT INTO social_log (time, uid, type, ip) VALUES (NOW(), :uid, :type, :ip);", array(':uid'=>$uid, ':type'=>$type, ':ip'=>$_SERVER['REMOTE_ADDR']));
        return true;
    }
}
