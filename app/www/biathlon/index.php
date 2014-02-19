<?php 
    $GTM_DATA = array('gameName' => 'biathlon');
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmGameBiathlon" lang="ru">
<head>
  <title>Биатлон</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameBiathlon -->
  <?php echo $head; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>social_biatlon.jpg"/>
  <meta property="og:url" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>biathlon/"/>
</head>
<body stm-game-biathlon-screen stm-preload></body>
</html>
