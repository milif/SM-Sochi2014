<?php

require_once __DIR__.'/../lib/DB.class.php';

$CODE_MAP = "1234567890QWERTYUPASDFGHJKLZXCVBNM";

$count = (int)$argv[1];
$expire = $argv[2];
$achievs = implode(",", array_slice($argv, 3));
for($i=0;$i<$count;$i++){
    $code = genCode();
    DB::query("INSERT INTO `code` (code, achievs, expire_date) VALUES ('$code', :achievs, :expire)", array(
        ':expire' => $expire,
        ':achievs' => $achievs
    ));
    echo $code."\n";
}

function genCode(){
    global $CODE_MAP;
    $code = "";
    for($i=0;$i<8;$i++){
        $k = min(strlen($CODE_MAP)-1,(int)floor(rand(0,strlen($CODE_MAP))));
        $code .= $CODE_MAP[$k]; 
    }
    return $code;
}
