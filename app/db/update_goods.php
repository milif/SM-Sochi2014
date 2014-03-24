<?php

require_once __DIR__.'/../lib/DB.class.php';

$reader = new XMLReader();
$reader->open(__DIR__."/goods.xml", 'UTF-8');
while($reader->read())
{
    $node = $reader->expand();
    var_dump($node);
}
$reader->close();
