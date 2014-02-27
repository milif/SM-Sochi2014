<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Cache.class.php';
require_once __DIR__.'/Achiev.class.php';

class Auth {
    private static $userData = null;
    static public function init(){
        if(is_null(self::$userData)){
            if(!isset($_COOKIE[SESSION_COOKIE])){
                self::$userData = false;
            } elseif(self::$userData = Cache::get("user_".$_COOKIE[SESSION_COOKIE])) {
            } else {
                $rs = DB::query("SELECT b.id, b.data, b.ref_key, a.expire FROM session as a LEFT JOIN user as b ON b.id=a.user_id WHERE a.key= :key AND expire > ".time(), array(':key'=>$_COOKIE[SESSION_COOKIE]));
                self::$userData = count($rs) ? array($rs[0]['id'] ,json_decode($rs[0]['data'], true), $rs[0]['ref_key']) : false;
                Cache::set("user_".$_COOKIE[SESSION_COOKIE], self::$userData, $rs[0]['expire']);
            }
        }
        define('CLIENT_ID', self::$userData ? self::$userData[0] : 0);
        if(self::$userData) define('REF_KEY', self::$userData[2]);
        if(CLIENT_ID == 0 && !isset($_COOKIE[SESSION_COOKIE.'_stmuid'])) {
            setcookie(SESSION_COOKIE.'_stmuid', uniqid(), 0, APP_ROOT_URL == "" ? "/" : APP_ROOT_URL);
        }
    }
    static public function login($cookie, $uri, $data){
        if(!$uri) return false;
        $expire = time() + SESSION_TIME;
        setcookie(SESSION_COOKIE, $cookie, $expire, APP_ROOT_URL == "" ? "/" : APP_ROOT_URL);
        $dataJSON = str_replace("'","",json_encode($data));
        $rs = DB::query("SELECT id, ref_key FROM user WHERE uri = :uri", array(':uri'=>$uri));
        if(count($rs)) {
            $id = $rs[0]['id'];
            $refKey = $rs[0]['ref_key'];
            DB::query("UPDATE user SET data='$dataJSON' WHERE uri= :uri", array(':uri'=>$uri));
        } else {
        
            $ref = $_COOKIE[SESSION_COOKIE.'_ref'];
            $refId = 0;
            if($ref){
                $ref = explode('.', $ref);
                $rs = DB::query("SELECT id FROM `user` WHERE ref_key = :refKey", array(":refKey" => $ref[0]));
                
                if(count($rs)){
                    $refId = $rs[0]['id'];
                }
            }        
        
            if($refId && isset($ref[1])){
                $rs = DB::query("SELECT COUNT(*) cc FROM `user` WHERE ref_id = $refId");
                if($rs[0]['cc'] >= 4 ) {
                    Achiev::add($ref[1].'.'.'journalist', $refId);
                }
            }
        
            $refKey = uniqid();
            DB::query("INSERT INTO user (uri, data, ref_key, ref_id, partner_ref, partner_subref) VALUES (:uri, :data, '$refKey', $refId, :partnerRef, :partnerSubref)", array(':uri'=>$uri,':data'=>$dataJSON, ':partnerRef'=>$_COOKIE['partner'], ':partnerSubref'=>$_COOKIE['subref']));
            $id = DB::lastInsertId();           
            
        }
        if(!$id) return false;
        DB::query("DELETE FROM session WHERE expire < ".time());
        DB::query("INSERT INTO session (`key`, expire, user_id) VALUES (:cookie, $expire, $id)", array(':cookie'=>$cookie));
        Cache::set("user_".$cookie, array($id, $data, $refKey), $expire);
        
        define('CLIENT_ID', $id);
        define('REF_KEY', $refKey);
        
        return true;
    }
    static public function logout(){
        if(!CLIENT_ID) return true;
        
        if(APP_ROOT_URL == "") {
            setcookie(SESSION_COOKIE, "", -1, "/");
        } else {
            setcookie(SESSION_COOKIE, "", -1, APP_ROOT_URL);
            setcookie(SESSION_COOKIE, "", -1, APP_ROOT_URL.'/../');
        }

        return true;
    }
    static public function isAuth(){
        return !!CLIENT_ID;
    }
    static public function getUser(){
        return self::$userData ? self::$userData[1] : null;
    }
    static public function checkSignature($data){
        $sign = isset($_SERVER['StmSignature']) ? $_SERVER['StmSignature'] : $_SERVER['HTTP_STMSIGNATURE'];
        $signTime = isset($_SERVER['StmSignatureTime']) ? $_SERVER['StmSignatureTime'] : $_SERVER['HTTP_STMSIGNATURETIME'];
       
        if(abs(time() - (int)$signTime) < 300 && md5($data.$signTime.'WEKTIF') == $sign) return true;
        
        header('HTTP/1.0 401 Unauthorized');
        exit;
    }
}

Auth::init();
