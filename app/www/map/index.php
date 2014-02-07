<!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Карта</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="../"></base>
  <!-- @include stmIndex -->
  <?php require __DIR__.'/../../tpl/head.php'; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>social.png"/>
</head>
<body game="true" stm-index-map urlprefix="../" stm-preload>
    <div stm-index-toolbar position="top"></div>
</body>
</html>
