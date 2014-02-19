<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/Socials.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Game.class.php';

if(!isset($GAME_DATA)) $GAME_DATA = array();
if(!isset($SHARE_URI)) $SHARE_URI = '/';

define('APP_ROOT_URL', str_replace($_SERVER['DOCUMENT_ROOT'], '', __DIR__.'/www'));

$api = array(
    "api/socials.php" => Socials::get($SHARE_URI)
);

$ENV = array(
    'auth' => array_merge(Auth::getUser(), array('refKey' => REF_KEY)),
    'api' => $api
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

