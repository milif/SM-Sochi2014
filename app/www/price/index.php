<?php 
    require __DIR__.'/../../lib/Product.class.php';

    $category = isset($_GET['c']) ? $_GET['c'] : 'home';
    $limit = 12;
    $page = isset($_GET['p']) ? $_GET['p'] : 0;
    $offset = $page * $limit;
    $order = isset($_GET['s']) ? $_GET['s'] : 'id';
    $filterValues = array(
        'f.price' => isset($_GET['f_price']) ? $_GET['f_price'] : null,
        'f.discount' => isset($_GET['f_discount']) ? $_GET['f_discount'] : null,
    );
    $page = "api/goods.php?c=$category&o=$offset&l=$limit&s=$order&f=".implode(',', $filterValues);
    
    $API = array(
        $page => array(
            'items' => Product::getItems($category, $filterValues, $order, $limit, $offset),
            'total' => Product::getTotalItems($category, $filterValues)
        )
    );
    $filters = Product::getFilters();
    $filterValuesQ = array();
    foreach($filters as $filterName => $filterItems){
        $filterValuesQ[] = array(
            'type' => $filterName,
            'value' => $filterValues[$filterName]
        );
        foreach($filterItems as $key => $item){
            $filters[$filterName][$key]['total'] = Product::getTotalItems($category, 
                array_merge($filterValues, array($filterName => $item['value']))
            );
        }    
    }

    $ENV = array(
        'goods' => array(
            'category' => $category,
            'offset' => $offset,
            'limit' => $limit,
            'order' => $order,
            'filters' => array(
                'items' => $filters,
                'values' => $filterValuesQ
             )
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
