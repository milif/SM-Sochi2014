<?php
    require __DIR__.'/../../lib/User.class.php';
    $confirm = User::confirmEmail($_GET['i'], $_GET['h']);
    $ENV = array(
        'confirmMsg' => $confirm === true ? 'Адрес электронной почты подтвержден.' : $confirm
    );     
    if($confirm === true){
        $admitad = preg_match('/^([^\.]+)/', $_COOKIE['subref'], $admitadReg) ? $admitadReg[1] : $_COOKIE['subref']; 
        $ENV = array_merge($ENV, array(
            'admitad' => in_array($_COOKIE['partner'], array('35626', '55887', '57105', '57135', '57143')) ? $admitad : null,
            'actionpay' => in_array($_COOKIE['partner'], array('49417','55885','57103', '57209', '57213')) ? $_COOKIE['subref'] : null,
            'userKey' => $_GET['i']        
        ));
    } 
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
