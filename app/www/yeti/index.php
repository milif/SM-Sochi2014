<?php 
    $GTM_DATA = array( 'gameName' => 'yeti');
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmGameEti" lang="ru">
<head>
  <title>Фотоохота на Йети</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameEti -->
  <?php echo $head; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].REQUEST_DIR).'/'; ?>social_yeti.jpg"/>
  <meta property="og:url" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>yeti/"/>
</head>
<body stm-game-eti-screen stm-preload></body>
</html>
