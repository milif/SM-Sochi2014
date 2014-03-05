<?php
    require __DIR__.'/../../lib/User.class.php';
    $confirm = User::confirmEmail($_GET['i'], $_GET['h']);
    $ENV = array(
        'confirmMsg' => $confirm === true ? 'Адрес электронной почты подтвержден.' : $confirm
    );    
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Подтверждение E-mail — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="<?php echo APP_ROOT_URL.'/'; ?>" />
  <!-- @include stmIndexConfirmation -->
  <?php echo $head; ?>
</head>
<body stm-index-confirmation stm-preload></body>
</html>
