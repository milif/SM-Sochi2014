<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/Socials.class.php';
require_once __DIR__.'/Auth.class.php';

$ENV = array(
    'auth' => Auth::getUser(),
    'api' => array(
        "api/socials.php" => Socials::get()
    )    
);
if(IS_PRODUCTION){
    $ENV['gtm'] = array(
        'id'=> GTM_ID,
        'data' => array(array_merge( array(
             'pageType' => 'Sochi2014'            
        ), isset($GTM_DATA) ? $GTM_DATA : array()))
    );
}
echo '<script type="text/javascript">angular.module("stm").value("$stmEnv", JSON.parse(\''.str_replace('\n','',json_encode($ENV)).'\'))</script>';

