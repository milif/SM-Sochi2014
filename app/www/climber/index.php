<?php 
    $GTM_DATA = array('gameName' => 'climber');
    $SHARE_URI = '/climber/';
    require __DIR__.'/../../lib/Game.class.php';
    $ENV = array(
        'gameData' => array(
            'passed' => Game::getClimberPassed()
        )
    );
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmGameClimber" lang="ru">
<head>
  <title>Альпинист</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameClimber -->
  <?php echo $head; ?>
</head>
<body stm-game-climber-screen stm-preload></body>
</html>
