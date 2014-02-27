<?php 
    
    require __DIR__.'/../../lib/Auth.class.php';
    require __DIR__.'/../../lib/Product.class.php';
    require __DIR__.'/../../lib/Game.class.php';
    require __DIR__.'/../../lib/User.class.php';
    
    if(!Auth::isAuth()){
        header('Location: '.APP_ROOT_URL == "" ? "/" : APP_ROOT_URL);
        exit;
    }
    
    $products = Product::getSale();
    shuffle($products);
    
    $ENV = array(
        'products' => array_slice($products, 0, 5),
        'games' => Game::getUserData(),
        'friends' => User::getFriendsCount()
    );
    
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmCabinet" lang="ru">
<head>
  <title>Личные достижения — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="../" />
  <!-- @include stmCabinet -->
  <?php echo $head; ?>
</head>
<body stm-cabinet-screen stm-preload></body>
</html>
