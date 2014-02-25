<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/../lib/DB.class.php';
require_once __DIR__.'/../lib/Achiev.class.php';

DB::query("UPDATE `user` SET climber_passed = 0;");

$id = 0;
$added = array();
while(true){
    $rs = DB::query("SELECT `id`, `data`, `user_id` FROM `game_log` WHERE `id` > $id AND `type` = 'climber' AND `action` = 'end' ORDER BY `id` LIMIT 0, 500;");
    if(count($rs) == 0) break;
    foreach($rs as $item){
        $itemData = json_decode($item['data'], true);
        if($itemData['final']) {
            DB::query("UPDATE `user` SET climber_passed = climber_passed + 1 WHERE id = ".$item['user_id']);
            $rs = DB::query("SELECT climber_passed FROM `user` WHERE id = ".$item['user_id']);
            if($rs && $rs[0]['climber_passed'] >= 10 && !isset($added[$item['user_id']])) {
                $added[$item['user_id']] = true;
                Achiev::add('climber.kingofhill', $item['user_id']);
            }            
        }
        $id = $item['id'];
    }
}
