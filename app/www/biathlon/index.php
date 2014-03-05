<?php 
    $GTM_DATA = array('gameName' => 'biathlon');
    $SHARE_URI = '/biathlon/';
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmGameBiathlon" lang="ru">
<head>
  <title>Биатлон</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="<?php echo APP_ROOT_URL.'/'; ?>"></base>
  <!-- @include stmGameBiathlon -->
  <?php echo $head; ?>
</head>
<body stm-game-biathlon-screen stm-preload></body>
</html>
