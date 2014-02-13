<?php require __DIR__.'/../lib/init.php' ?><!doctype html>
<html ng-app="stmIndexPage" lang="ru">
<head>
  <title>Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="." />
  <!-- @include stmIndexPage -->  
  <?php echo $head; ?>
  <meta property="og:image" content="http://<?php echo $_SERVER["HTTP_HOST"].$REQUEST_DIR.'/'; ?>social.png"/>
</head>
<body stm-index-page-screen stm-preload></body>
</html>
