<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';

class Achiev {
    static public function add($achiev, $userId = CLIENT_ID){
        $achievData = explode('.', $achiev);
        $rs = DB::query("SELECT id FROM `achievement_log` WHERE user_id = $userId AND `key` = :achiev;", array(':achiev' => $achiev));
        if(count($rs)) return;
        
        DB::query("INSERT INTO `achievement_log` (user_id, `key`) VALUES ($userId, :achiev);", array(':achiev' => $achiev));
        $rs = DB::query("SELECT data_achievement_{$achievData[0]} as achiev FROM `user` WHERE id = $userId;");
        if(count($rs)){
            $achievs = explode(',', $rs[0]['achiev']);
            if(!$achievs[0]) unset($achievs[0]);
            if(!in_array($achiev, $achievs)) {
                $achievs[] = $achiev;
                DB::query("UPDATE `user` SET data_achievement_{$achievData[0]} = :achievs WHERE id = $userId;", array(":achievs" => implode(',', $achievs)));
            }
        }
    }
}
