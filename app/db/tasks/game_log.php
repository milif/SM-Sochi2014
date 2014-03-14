<?php

$rs = DB::query("SHOW INDEXES FROM `game_log` LIKE 'type';");
if(!count($rs)){
    DB::query("ALTER TABLE `game_log` ADD INDEX `type` (`type`);");
}
$rs = DB::query("SHOW INDEXES FROM `game_log` LIKE 'action';");
if(!count($rs)){
    DB::query("ALTER TABLE `game_log` ADD INDEX `action` (`action`);");
}
$rs = DB::query("SHOW INDEXES FROM `game_log` LIKE 'time';");
if(!count($rs)){
    DB::query("ALTER TABLE `game_log` ADD INDEX `time` (`time`);");
}

$rs = DB::query("SHOW COLUMNS FROM `game_log` LIKE 'score';");
if(!count($rs)){
        DB::query("
            ALTER TABLE `game_log` ADD COLUMN `score` INT;
            ALTER TABLE `game_log` ADD INDEX `score` (`score`);
        ");
}
$rs = DB::query("SHOW COLUMNS FROM `game_log` LIKE 'uid';");
if(!count($rs)){
        DB::query("
            ALTER TABLE `game_log` ADD COLUMN `uid` BIGINT;
            ALTER TABLE `game_log` ADD INDEX `uid` (`uid`);
        ");
}
while (true){
    $q = "SELECT id, data, type FROM `game_log` WHERE score IS NULL AND action = 'end' LIMIT 0,500;";
    echo $q."\n";
    $rs = DB::query($q); 
    if(!count($rs)) break;
    foreach($rs as $item){
        $score = 0;
        $data = json_decode($item['data'], true);
        switch ($item['type']) {
            case "climber":
                $score = $data['score']['total'];
                break;
            case "biathlon":
                $score = $data['score']['total'];
                break;
            case "yeti":
                $score = $data['score'];
                break;
        }
        DB::query("UPDATE `game_log` SET score = ".((int)$score)." WHERE id = {$item['id']};");
    }
}
