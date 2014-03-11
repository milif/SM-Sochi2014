<?php

$rs = DB::query("
CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz` varchar(128) NOT NULL,
  `type` varchar(32) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `page` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz` (`quiz`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
");

$handle = fopen(__DIR__.'/../quiz.csv', "r");
$data = array();
while (($line = fgetcsv($handle, 0)) !== FALSE) { 
    $data[] = $line;
}
fclose($handle);
DB::query("TRUNCATE TABLE `quiz`;");
foreach($data as $i => $row){
    if($i == 0 || !$row[2]) continue;
    $quiz = $row[0];
    $question = preg_replace( array('/[\n]/s','/^[\d\.\s]+/','/[\s]+$/s'), array('','',''),$row[1]);
    $type = trim(mb_strtolower($row[2], 'UTF-8'));
    if($type == 'текст') $type = 'text';
    elseif(mb_strpos($type, 'радио', 0, 'UTF-8') !== FALSE) $type = 'radio';
    $answer = preg_replace( array('/[\n;]+/','/[,]+$/','/(^|,)\s+/'), array(';','',''),$row[3]);
    $page = trim($row[4]); 
    DB::query("INSERT INTO `quiz` (`quiz`, `question`, `type`, `answer`, `page`) VALUES (:quiz, :question, :type, :answer, :page);", array(':quiz' => $quiz,':question' => $question, ':type' => $type, ':answer' => $answer, ':page' => $page));
}
