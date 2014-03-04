<?php require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Карта</title>
  <link rel="stylesheet" href="index.css" type="text/css">
  <base href="<?php echo APP_ROOT_URL.'/'; ?>"></base>
  <!-- @include stmIndex -->
  <?php echo $head; ?>
</head>
<body game="true" stm-index-map urlprefix="../" stm-preload>
    <div stm-index-toolbar position="top"></div>
</body>
</html>
