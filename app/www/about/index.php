<?php require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>О проекте — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="../" />
  <!-- @include stmIndexAbout -->
  <?php echo $head; ?>
  <meta property="og:image" content="http://<?php echo dirname($_SERVER["HTTP_HOST"].$REQUEST_DIR).'/'; ?>social.png"/>
</head>
<body stm-index-about stm-preload></body>
</html>
