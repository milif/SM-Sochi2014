<?php

$rs = DB::query("
CREATE TABLE IF NOT EXISTS `mnogo_card` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `code` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_key` (`user_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
");

$rs = DB::query("SHOW INDEX FROM `mnogo_card` WHERE Column_name LIKE 'code'");
if(!count($rs)){
        DB::query("
            ALTER TABLE `mnogo_card` ADD INDEX `code` (`code`);
        ");
}
