<!doctype html>
<html ng-app="stmGameEti" lang="ru">
<head>
  <title>Фотоохота на Йети</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameEti -->
  <?php 
    $GTM_DATA = array( 'gameName' => 'yeti');
    require __DIR__.'/../../tpl/head.php'; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].REQUEST_DIR).'/'; ?>social.png"/>
</head>
<body stm-game-eti-screen stm-preload></body>
</html>
