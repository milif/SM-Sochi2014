<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Product.class.php';
require_once __DIR__.'/../../lib/User.class.php';

$params = Product::getParamsFrom($_GET);   
$hasPermission = User::hasPermissionPrice(); 
$filters = $hasPermission ? Product::getFilters($params) : array();

echo json_encode( array(
    'filters' => $filters,
    'hasPermission' => $hasPermission,
    'items' => $hasPermission ? array(
        'data' => Product::getItems($params),
        'total' => (int)Product::getTotalItems($params)
    ) : array('data'=> array(), 'total' => 0),
));
