-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 06 2014 г., 02:45
-- Версия сервера: 5.5.35
-- Версия PHP: 5.5.3-1ubuntu2.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- База данных: `sochi2014`
--

-- --------------------------------------------------------

--
-- Структура таблицы `game_log`
--

CREATE TABLE IF NOT EXISTS `game_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(32) NOT NULL,
  `action` varchar(32) NOT NULL,
  `data` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- Структура таблицы `session`
--

CREATE TABLE IF NOT EXISTS `session` (
  `key` varchar(128) CHARACTER SET utf8 NOT NULL,
  `expire` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `expire` (`expire`)
) ENGINE=MEMORY DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `social_log`
--

CREATE TABLE IF NOT EXISTS `social_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL,
  `uid` varchar(32) NOT NULL,
  `ip` varchar(32) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `type` (`type`),
  KEY `time` (`time`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Структура таблицы `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uri` varchar(500) NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uri` (`uri`(333))
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

