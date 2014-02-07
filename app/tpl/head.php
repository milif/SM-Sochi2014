 <?php
    $REQUEST_DIR = $_SERVER["REQUEST_URI"];
    if(!preg_match('/\/$/',$REQUEST_DIR)) {
        $REQUEST_DIR = dirname($REQUEST_DIR);
    } else {
        $REQUEST_DIR = substr($REQUEST_DIR,0,-1);
    }
    define('REQUEST_DIR', $REQUEST_DIR);
 ?>
  <link rel="shortcut icon" href="favicon.ico"/>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1024">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">
  <meta property="og:title" content="Сочные игры 2014"/>
  <meta property="og:description" content="Не пропусти начало сочных викторин и розыгрыша сочных призов от Сотмаркета."/>    
  <?php require_once __DIR__.'/../lib/env.php'; ?>
  <?php try{include_once __DIR__.'/../partner.php';} catch(Exception $e){};?>
