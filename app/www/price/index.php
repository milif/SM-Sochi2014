<?php 
    require_once __DIR__.'/../../lib/DB.class.php';
    require_once __DIR__.'/../../lib/Product.class.php';
    require_once __DIR__.'/../../lib/Auth.class.php';
    require_once __DIR__.'/../../lib/User.class.php';
    
    if(CLIENT_ID && isset($_GET['d']) && md5(CLIENT_ID.'price') == $_GET['d']) {
        DB::update("UPDATE `user` SET price_access = 1 WHERE id = ".CLIENT_ID." AND price_access = 0;");
    }
    
    $params = Product::getParamsFrom($_GET);
    $hasPermission = User::hasPermissionPrice();
    $filters = $hasPermission ? Product::getFilters($params) : array();

    $ENV = array(
        'goods' => array(
            'filters' => $filters,
            'hasPermission' => $hasPermission,
            'items' => $hasPermission ? array(
                'data' => Product::getItems($params),
                'total' => (int)Product::getTotalItems($params)
            ) : array('data'=> array(), 'total' => 0),
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
