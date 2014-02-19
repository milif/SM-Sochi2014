<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Game.class.php';
require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/Mnogo.class.php';

$data = file_get_contents("php://input");

Auth::checkSignature($data);

$bestGame = Game::save(json_decode($data, true));

echo json_encode( $bestGame ? array_merge($bestGame, array(
    'hasMnogo' => Mnogo::has()
)) : array('success' => false));
