<?php

require_once __DIR__.'/../lib/DB.class.php';

$dir = __DIR__.'/tasks';

$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));

while($it->valid()) {

    if (!$it->isDot()) {
        require_once  $it->key();
    }

    $it->next();
}
