<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Game.class.php';
require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/Mnogo.class.php';

$data = file_get_contents("php://input");

Auth::checkSignature($data);

$result = array_merge(Game::save(json_decode($data, true)), array(
    'hasMnogo' => Mnogo::has()
));

echo json_encode(is_array($result) ? $result : array('success' => true));
