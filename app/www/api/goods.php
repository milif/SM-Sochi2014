<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Product.class.php';
require_once __DIR__.'/../../lib/User.class.php';

$params = Product::getParamsFrom($_GET);   
$hasPermission = User::hasPermissionPrice(); 
$filters = Product::getFilters($params);

echo json_encode( array(
    'filters' => $filters,
    'hasPermission' => $hasPermission,
    'items' => array(
        'data' => Product::getItems($params, $hasPermission),
        'total' => (int)Product::getTotalItems($params)
    )
));
