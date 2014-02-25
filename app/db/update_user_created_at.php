<?php

require_once __DIR__.'/../lib/DB.class.php';

DB::query("UPDATE `user` SET created_at = 0;");
DB::query("UPDATE `user` b INNER JOIN (SELECT `user_id`, MIN(`time`) as time FROM `game_log` GROUP BY `user_id`) a ON a.user_id = b.id SET b.created_at = a.time;");

