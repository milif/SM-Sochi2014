<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';

class Achiev {
    static public function getAchievsBonus(){
        return array(
            'other.friends' => 100,
            'map.yetiwanted'=> 100,
            'map.yeti' => 100,
            'map.horns'=> 100,
            'map.actually' => 100,
            'map.pickpoint' => 150,
            'map.quelle' => 200,
            'map.proskeyter' => 200,
            'map.caveoffear' => 300,
            'map.maxim' => 100,
            'map.sotmarket' => 200,
            'map.dpd' => 150,
            'map.groupon' => 150,
            'map.qiwi' => 200,
            'map.mnogo'=> 150,
            'map.sportexpress' => 150
        );
    }
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
