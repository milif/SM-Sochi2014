<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/DB.class.php';
require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/User.class.php';
require_once __DIR__.'/../../lib/Cache.class.php';

$dataJson = file_get_contents("php://input");
$data = json_decode($dataJson, true);

if(isset($data['email'])) {
    DB::update("UPDATE `user` SET `email` = :email WHERE id = ".CLIENT_ID, array(':email' => $data['email']));
    Cache::remove('userdata.'.CLIENT_ID);
    Cache::remove('isreg.'.CLIENT_ID);
}
if(isset($data['send'])) {
    DB::update("UPDATE `user` SET `confirmation_mail_sent` = NULL WHERE id = ".CLIENT_ID);
}

$resp = array('success' => true);

echo json_encode($resp);
