<?php

define('CACHE_HOST', 'localhost');
define('CACHE_PORT', 11211); // 0 for Unix socket
define('CACHE_KEY_PREFIX', 'sochi2014_');

define('DB_HOST', 'localhost');
define('DB_USER', 'sochi2014');
define('DB_PASSWORD', 'sochi2014');
define('DB_NAME', 'sochi2014');

define('SESSION_TIME',  86400 * 7);
define('SESSION_COOKIE', 'sochi2014');

define("GTM_ID", 'GTM-TMZ66K');

define('IS_PRODUCTION', is_file(__DIR__.'/.production'));

