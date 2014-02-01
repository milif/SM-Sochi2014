<?php

require_once __DIR__.'/Socials.class.php';

$ENV = array(
    'api' => array(
        "api/socials.php" => Socials::get()
    )
);

echo '<script type="text/javascript">angular.module("stm").value("$stmEnv", JSON.parse(\''.json_encode($ENV).'\'))</script>';


