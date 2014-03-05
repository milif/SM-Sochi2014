<?php

$rs = DB::query("
CREATE TABLE IF NOT EXISTS `subscribe` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(128) NOT NULL UNIQUE,
  PRIMARY KEY (`id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
");
$rs = DB::query("SHOW COLUMNS FROM `subscribe` LIKE 'partner_ref';");
if(!count($rs)){
        DB::query("
            ALTER TABLE `subscribe` ADD COLUMN `partner_ref` VARCHAR(128);
            ALTER TABLE `subscribe` ADD COLUMN `partner_subref` VARCHAR(128);
        ");
}
