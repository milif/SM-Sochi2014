<?php 
    require __DIR__.'/../../lib/Product.class.php';
    $time = time();
    $toTime = strtotime("2014-03-31 00:00:00 Europe/Moscow");
    if($time >= $toTime) {
        $toTime = strtotime("2014-05-01 00:00:00 Europe/Moscow");
    }
    $ENV = array (
        'time' => $toTime * 1000,
        'products' => Product::getSale()
    );    
    $SHARE_URI = '/sale/';
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Вагон подарков — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="<?php echo APP_ROOT_URL.'/'; ?>" />
  <!-- @include stmIndexSale -->
  <?php echo $head; ?>
</head>
<body stm-index-sale stm-preload></body>
</html>
