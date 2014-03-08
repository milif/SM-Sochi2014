<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/Socials.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Game.class.php';
require_once __DIR__.'/User.class.php';

if(!isset($GAME_DATA)) $GAME_DATA = array();
if(!isset($SHARE_URI)) $SHARE_URI = '/';

if(isset($_GET['email'])){
    setcookie(SESSION_COOKIE.'_email', $_GET['email'], time() + 604800, APP_ROOT_URL);
}

$api = array(
    "api/socials.php" => Socials::get($SHARE_URI)
);

$ENV = array_merge(array(
    'auth' => User::getData(),
    'api' => $api,
    'isProduction' => IS_PRODUCTION
), isset($ENV) ? $ENV : array());

if(IS_PRODUCTION){
    $ENV['gtm'] = array(
        'id'=> GTM_ID,
        'data' => array(array_merge( array(
             'pageType' => 'Sochi2014'            
        ), isset($GTM_DATA) ? $GTM_DATA : array()))
    );
}
if(isset($ENV['auth']['name'])) {
    $ENV['auth']['name'] = iconv("UTF-8", "UTF-8//IGNORE", $ENV['auth']['name']);
}
echo '<script type="text/javascript">angular.module("stm").value("$stmEnv", JSON.parse(\''.str_replace('\n','',json_encode($ENV)).'\'))</script>';

