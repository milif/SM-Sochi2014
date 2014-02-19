<?php 
    $GTM_DATA = array( 'gameName' => 'yeti');
    $SHARE_URI = '/yeti/';
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmGameEti" lang="ru">
<head>
  <title>Фотоохота на Йети</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameEti -->
  <?php echo $head; ?>
</head>
<body stm-game-eti-screen stm-preload></body>
</html>
