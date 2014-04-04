<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/User.class.php';

$dataJson = file_get_contents("php://input");
$data = json_decode($dataJson, true);

$data['dob'] = $data['dob'] ? substr($data['dob'], 4).'-'.substr($data['dob'], 2, 2).'-'.substr($data['dob'], 0, 2) : NULL;
$data['phone'] = $data['phone'] ? $data['phone_country'].$data['phone'] : NULL;

$success = User::save($data);

$resp = array('success' => $success === true);

if(is_string($success)) $resp['error'] = $success;

echo json_encode($resp);
