<!doctype html>
<html ng-app="stmGameBiathlon" lang="ru">
<head>
  <title>Биатлон</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmGameBiathlon -->
  <?php require __DIR__.'/../../tpl/head.php'; ?>
  <meta property="og:image" content="http://<?php echo $_SERVER["HTTP_HOST"].$REQUEST_DIR.'/../'; ?>social.png"/>
</head>
<body stm-game-biathlon-screen stm-preload></body>
</html>
