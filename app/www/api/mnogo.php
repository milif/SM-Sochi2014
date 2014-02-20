<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Mnogo.class.php';
require_once __DIR__.'/../../lib/Auth.class.php';

$dataJson = file_get_contents("php://input");
$data = json_decode($dataJson, true);

$success = Mnogo::add($data['code']);

$resp = array('success' => $success === true);

if(is_string($success)) $resp['error'] = $success;

echo json_encode($resp);
