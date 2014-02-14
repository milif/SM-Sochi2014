<?php 
    $GTM_DATA = array('gameName' => 'climber');
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmGameClimber" lang="ru">
<head>
  <title>Альпинист</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameClimber -->
  <?php echo $head; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>social_alpinist.jpg"/>
</head>
<body stm-game-climber-screen stm-preload></body>
</html>
