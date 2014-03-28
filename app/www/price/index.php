<?php 
    require __DIR__.'/../../lib/Product.class.php';
    
    $params = Product::getParamsFrom($_GET);
    $filters = Product::getFilters($params);

    $ENV = array(
        'goods' => array(
            'filters' => $filters,
            'items' => array(
                'data' => Product::getItems($params),
                'total' => (int)Product::getTotalItems($params)
            ),
            'params' => $params
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
