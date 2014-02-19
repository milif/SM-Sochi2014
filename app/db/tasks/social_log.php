<?php

$rs = DB::query("SHOW COLUMNS FROM `social_log` LIKE 'uri';");
if(!count($rs)){
        DB::query("
            ALTER TABLE `social_log` ADD COLUMN `uri` varchar(256);
            ALTER TABLE `social_log` ADD INDEX `uri` (`uri`);
        ");
}

$rs = DB::query("UPDATE `social_log` SET uri = '/' WHERE uri IS NULL;");
