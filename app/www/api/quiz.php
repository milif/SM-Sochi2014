<?php
header('Content-Type: application/json');

require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/Quiz.class.php';

$data = file_get_contents("php://input");

Auth::checkSignature($data);

$answers = json_decode($data, true);

$correct = Quiz::check($answers);

echo json_encode(array(
    'passed' => count($correct) == count($answers),
    'correct' => count($correct)
));
