<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Product.class.php';

$params = Product::getParamsFrom($_GET);
$filters = Product::getFilters($params);    

echo json_encode( array(
    'filters' => $filters,
    'items' => array(
        'data' => Product::getItems($params),
        'total' => (int)Product::getTotalItems($params)
    )
));
