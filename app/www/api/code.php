<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Code.class.php';

$dataJson = file_get_contents("php://input");
$data = json_decode($dataJson, true);

$data = Code::usecode($data['code']);

$resp = array('success' => is_string($data) ? false : true);

if(is_string($data)) $resp['error'] = $data;
else $resp['data'] = $data;

echo json_encode($resp);
