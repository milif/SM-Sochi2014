<?php

require_once __DIR__.'/../config.php';

if(isset($_GET['ref'])){
    setcookie(SESSION_COOKIE.'_ref', $_GET['ref'].'.'.basename(dirname($_SERVER['REQUEST_URI'])), 0, dirname($_SERVER['REQUEST_URI']));
    header("Location: ".strtok($_SERVER["REQUEST_URI"],'?'));
    exit;
}
if(!IS_PRODUCTION && isset($_GET['delete_user'])){
    require_once __DIR__.'/DB.class.php';
    require_once __DIR__.'/Auth.class.php';
    require_once __DIR__.'/Cache.class.php';
    DB::query("
        DELETE FROM `user` WHERE id = ".CLIENT_ID.";
        DELETE FROM `session` WHERE user_id = ".CLIENT_ID.";
    ");
    Cache::remove("user_".$_COOKIE[SESSION_COOKIE]);
    header("Location: ".strtok($_SERVER["REQUEST_URI"],'?'));
    exit;
}

ob_start();
require __DIR__.'/../tpl/head.php';
$head = ob_get_contents();
ob_end_clean();
