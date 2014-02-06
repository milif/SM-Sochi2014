<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Game.class.php';

$data = json_decode(file_get_contents("php://input"), true);

echo json_encode(array(
    'success' => Game::save($data)
));
