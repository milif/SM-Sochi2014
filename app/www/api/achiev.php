<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Game.class.php';
require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/Achiev.class.php';

$dataJson = file_get_contents("php://input");

Auth::checkSignature($dataJson);

$data = json_decode($dataJson, true);

Achiev::add($data['key']);

echo json_encode(array('success' => true));
