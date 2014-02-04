<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/Socials.class.php';

$ENV = array(
    'clientId' => CLIENT_ID, 
    'api' => array(
        "api/socials.php" => Socials::get()
    )
);

echo '<script type="text/javascript">angular.module("stm").value("$stmEnv", JSON.parse(\''.json_encode($ENV).'\'))</script>';


