<?php

require_once __DIR__.'/../lib/DB.class.php';

$TYPES = array(
    'DPD' => 'dpd',
    'Groupon' => 'groupon',
    'Maxim' => 'maxim',
    'PickPoint' => 'pickpoint',
    'Qiwi Wallet' => 'qiwi',
    'Quelle' => 'quelle',
    'Много.ру' => 'mnogo',
    'Пещера Страха' => 'caveoffear',
    'Проскейтер' => 'proskeyter',
    'Сотмаркет' => 'sotmarket',
    'Софткей' => 'softkey',
    'СпортЭкспресс' => 'sportexpress'
);

$handle = fopen(__DIR__.'/quiz.csv', "r");
$data = array();
while (($line = fgetcsv($handle, 0)) !== FALSE) { 
    $data[] = $line;
}
fclose($handle);
DB::query("TRUNCATE TABLE `quiz`;");
foreach($data as $i => $row){
    if($i == 0 || !$row[2]) continue;
    $quiz = $TYPES[$row[0]];
    $question = preg_replace( array('/[\n]/s','/^[\d\.\s]+/','/[\s]+$/s'), array('','',''),$row[1]);
    $_type = trim(mb_strtolower($row[2], 'UTF-8'));
    $type = false;
    if($_type == 'текст') $type = 'text';
    elseif(mb_strpos($_type, 'радио', 0, 'UTF-8') !== FALSE) $type = 'radio';
    if(!$type) continue;
    $answer = preg_replace( array('/\s+\n/','/[\n;]+/','/[,]+$/','/(^\s+|,\s+$)/', '/;$/'), array("\n",';','','',''),$row[3]);
    $page = trim($row[4]); 
    DB::query("INSERT INTO `quiz` (`quiz`, `question`, `type`, `answer`, `page`) VALUES (:quiz, :question, :type, :answer, :page);", array(':quiz' => $quiz,':question' => $question, ':type' => $type, ':answer' => $answer, ':page' => $page));
}
