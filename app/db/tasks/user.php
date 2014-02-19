<?php

require_once __DIR__.'/achievement_log.php';
require_once __DIR__.'/game_log.php';

$rs = DB::query("SHOW COLUMNS FROM `user` LIKE 'ref_key';");
if(!count($rs)){
        DB::query("
            ALTER TABLE `user` ADD COLUMN `ref_key` varchar(32);
            ALTER TABLE `user` ADD INDEX `ref_key` (`ref_key`);
        ");
}
$rs = DB::query("SHOW COLUMNS FROM `user` LIKE 'ref_id';");
if(!count($rs)){
        DB::query("
            ALTER TABLE `user` ADD COLUMN `ref_id` INT;
        ");
}
while (true){
    $q = "SELECT id FROM `user` WHERE ref_key IS NULL LIMIT 0,500;";
    echo $q."\n";
    $rs = DB::query($q);
    if(!count($rs)) break;
    foreach($rs as $item){
        DB::query("UPDATE `user` SET ref_key = '".uniqid()."' WHERE id = ".$item['id']);
    }
}
$ITEMS = array(
    'climber',
    'biathlon',
    'yeti'
);

foreach ($ITEMS as $item){
    _gameLogIndexItem($item);
    _achievementLogIndexItem($item);
}

function _gameLogIndexItem($item){
    $rs = DB::query("SHOW COLUMNS FROM `user` LIKE 'data_game_$item';");
    if(!count($rs)){
        DB::query("ALTER TABLE `user` ADD COLUMN `data_game_$item` TEXT;");
    } 
    $rs = DB::query("SHOW COLUMNS FROM `user` LIKE 'score_game_$item';");
    if(!count($rs)){
        DB::query("ALTER TABLE `user` ADD COLUMN `score_game_$item` INT DEFAULT 0;");
    }
    $q = "UPDATE `user` u INNER JOIN (SELECT a.user_id, a.data, a.score FROM game_log a INNER JOIN (SELECT b.user_id, max(b.score) score FROM `user` a LEFT JOIN `game_log` b ON b.user_id = a.id WHERE `data_game_$item` IS NULL AND b.type='$item' AND b.action = 'end' GROUP BY b.user_id) b ON a.score = b.score AND a.user_id = b.user_id LIMIT 1) a ON u.id = a.user_id SET u.data_game_$item = a.data, u.score_game_$item = a.score";
    echo $q."\n";
    DB::query($q);
}
function _achievementLogIndexItem($item){
    $rs = DB::query("SHOW COLUMNS FROM `user` LIKE 'data_achievement_$item';");
    if(!count($rs)){
        DB::query("ALTER TABLE `user` ADD COLUMN `data_achievement_$item` TEXT;");
    }
    $q = "UPDATE `user` u INNER JOIN (SELECT a.id, GROUP_CONCAT(b.key) achievement FROM `user` a LEFT JOIN `achievement_log` b ON b.user_id = a.id WHERE `data_achievement_$item` IS NULL AND b.key LIKE '$item.%' GROUP BY a.id) a ON u.id = a.id SET u.`data_achievement_$item` = a.achievement";
    echo $q."\n";
    DB::query($q);
}
