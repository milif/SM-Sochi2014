<?php
    require __DIR__.'/../../lib/User.class.php';
    $confirm = User::confirmEmail($_GET['i'], $_GET['h']);
    $ENV = array(
        'confirmMsg' => $confirm === true ? 'Адрес электронной почты подтвержден.' : $confirm
    );
    $partner = User::getPartnerByKey($_GET['i']);
    if($confirm === true){
        $beforepoint = preg_match('/^([^\.]+)/', $partner[1], $regex) ? $regex[1] : $partner[1]; 
        $ENV = array_merge($ENV, array(
            'admitad' => in_array($partner[0], array('35626', '55887', '57105', '57135', '57143')) ? $beforepoint : null,
            'actionpay' => in_array($partner[0], array('49417','55885','57103', '57209', '57213')) ? $partner[1] : null,
            'am15' => in_array($partner[0], array('57211','54479')) ? true : null,
            'cityadspix' => in_array($partner[0], array('49377', '57107', '57109', '57121', '57207')) ? $beforepoint : null,
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
