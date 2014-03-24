<?php 
    require __DIR__.'/../../lib/Product.class.php';

    $category = isset($_GET['c']) ? $_GET['c'] : 'test';
    $offset = isset($_GET['o']) ? $_GET['o'] : 0;
    $limit = isset($_GET['l']) ? $_GET['l'] : 12;
    $order = isset($_GET['s']) ? $_GET['s'] : 'id';
    $page = "api/goods.php?c=$category&o=$offset&l=$limit&s=$order";
    
    $API = array(
        $page => array(
            'items' => Product::getItems($category, $order, $limit, $offset),
            'total' => Product::getTotalItems($category)
        )
    );
    $ENV = array(
        'goods' => array(
            'category' => $category,
            'offset' => $offset,
            'limit' => $limit,
            'order' => $order
        )
    );
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Сочные Цены — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="<?php echo APP_ROOT_URL.'/'; ?>" />
  <!-- @include stmIndexPrice -->
  <?php echo $head; ?>
</head>
<body stm-index-sochi-price stm-preload></body>
</html>
