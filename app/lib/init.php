<?php

require_once __DIR__.'/../config.php';

if(isset($_GET['ref'])){
    setcookie(SESSION_COOKIE.'_ref', $_GET['ref'].'.'.basename(dirname($_SERVER['REQUEST_URI'])), 0, dirname($_SERVER['REQUEST_URI']));
    header("Location: ".strtok($_SERVER["REQUEST_URI"],'?'));
    exit;
}

ob_start();
require __DIR__.'/../tpl/head.php';
$head = ob_get_contents();
ob_end_clean();
