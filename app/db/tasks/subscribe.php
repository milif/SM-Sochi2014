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
