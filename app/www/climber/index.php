<!doctype html>
<html ng-app="stmGameClimber" lang="ru">
<head>
  <title>Альпинист</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameClimber -->
  <?php 
    $GTM_DATA = array( 'gameName' => 'climber');
    require __DIR__.'/../../tpl/head.php'; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>social.png"/>
</head>
<body stm-game-climber-screen stm-preload></body>
</html>