<?php

$rs = DB::query("
CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz` varchar(128) NOT NULL,
  `type` varchar(32) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `page` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz` (`quiz`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
CREATE TABLE IF NOT EXISTS `quiz_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(32) NOT NULL,
  `data` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `correct` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`),
  KEY `time` (`time`),
  KEY `correct` (`correct`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
");


