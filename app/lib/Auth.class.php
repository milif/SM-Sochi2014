<?php

require_once __DIR__.'/../config.php';
require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Cache.class.php';

class Auth {
    private static $userData = null;
    static public function init(){
        if(is_null(self::$userData)){
            if(!isset($_COOKIE[SESSION_COOKIE])){
                self::$userData = false;
            } elseif(self::$userData = Cache::get("user_".$_COOKIE[SESSION_COOKIE])) {
            } else {
                $rs = DB::query("SELECT b.id, b.data FROM session as a LEFT JOIN user as b ON b.id=a.user_id WHERE a.key= :key AND expire > ".time(), array(':key'=>$_COOKIE[SESSION_COOKIE]));
                self::$userData = count($rs) ? array($rs[0]['id'] ,json_decode($rs[0]['data'], true)) : false;            
            }
        }   
        define('CLIENT_ID', self::$userData ? self::$userData[0] : 0);
        if(CLIENT_ID == 0 && !isset($_COOKIE['__stmuid'])) {
            setcookie('__stmuid', uniqid(), 0, dirname(dirname($_SERVER['REQUEST_URI'])));
        }
    }
    static public function login($cookie, $uri, $data){
        if(!$uri) return false;
        $expire = time() + SESSION_TIME;
        setcookie(SESSION_COOKIE, $cookie, $expire, dirname(dirname($_SERVER['REQUEST_URI'])));
        $dataJSON = str_replace("'","",json_encode($data));
        $rs = DB::query("SELECT id FROM user WHERE uri = :uri", array(':uri'=>$uri));
        if(count($rs)) {
            $id = $rs[0]['id'];
            DB::query("UPDATE user SET data='$dataJSON' WHERE uri= :uri", array(':uri'=>$uri));
        } else {
            DB::query("INSERT INTO user (uri, data) VALUES (:uri, :data)", array(':uri'=>$uri,':data'=>$dataJSON));
            $id = DB::lastInsertId();
        }
        DB::query("DELETE FROM session WHERE expire < ".time());
        DB::query("INSERT INTO session (`key`, expire, user_id) VALUES (:cookie, $expire, $id)", array(':cookie'=>$cookie));
        Cache::set("user_".$cookie, array($id,$data), $expire);
        return true;
    }
    static public function getUser(){
        return self::$userData ? self::$userData[1] : null;
    }
}

Auth::init();
