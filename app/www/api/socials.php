<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Socials.class.php';

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'];

if($action == 'add') {
    echo json_encode(array(
        'success' => Socials::add($data['uri'], $data['type'])
    ));
}
