<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/VoteGoods.class.php';

$dataJson = file_get_contents("php://input");

Auth::checkSignature($dataJson);

$data = json_decode($dataJson, true);

if($data['action'] == 'get') {
    $items = VoteGoods::getItems();
    $voted = VoteGoods::getVoted();

    $resp = array(
        'items' => $items,
        'voted' => $voted
    );

    echo json_encode($resp);
} elseif($data['action'] == 'vote') {
    VoteGoods::vote($data['id']);
    echo json_encode(array('success' => true));
}

