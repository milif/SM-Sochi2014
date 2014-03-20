<?php
    require __DIR__.'/../../lib/User.class.php';
    $unsubscribe = User::unsubscribe($_GET['i'], $_GET['h']);
    $ENV = array(
        'unsubscribeMsg' => $unsubscribe === true ? 'E-mail '.User::getEmailByKey($_GET['i']).' успешно отписан от рассылки.' : $unsubscribe
    );
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Отписка от писем — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="<?php echo APP_ROOT_URL.'/'; ?>" />
  <!-- @include stmIndexUnsubscribe -->
  <?php echo $head; ?>
</head>
<body stm-index-unsubscribe stm-preload></body>
</html>
