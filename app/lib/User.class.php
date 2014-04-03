<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Cache.class.php';

class User {
    const CONFIRM_ERROR = 'Ошибка при подтверждении адреса электронной почты.';
    const CONFIRM_ERROR_HAS = 'Данный аккаунт уже зарегистрирован.';
    const UNSUBSCRIBE_ERROR = 'Ошибка при отписке.';
    const UNSUBSCRIBE_ERROR_HAS = 'Адрес <b>%s</b> уже отписан от всех рассылок.';
    static public function getFriendsCount(){
        if(CLIENT_ID == 0) return 0;
        $key = 'friends.'.CLIENT_ID;
        $counter = Cache::get($key);
        if($counter !== false) return (int)$counter;
        
        $rs = DB::query("SELECT COUNT(*) as count FROM `user` WHERE ref_id = ".CLIENT_ID);
        $count = $rs[0]['count'];
        Cache::set($key, $count, 1200);
        return (int)$count;
    }
    static public function isConfirmation($userId = 0){
        if(!$userId) $userId = CLIENT_ID;
        if(!$userId) return false;
        if(!CLIENT_ID) return false;
        $key = 'isconfrm.'.$userId;
        $isConfrm = Cache::get($key);
        if($isConfrm !== false) return !!$isConfrm;
        
        $rs = DB::query("SELECT COUNT(*) as count FROM `user` WHERE `is_confirmed` > 0 AND id = ".$userId);
        $isConfrm = $rs[0]['count'];
        Cache::set($key, $isConfrm, 1200);
        return !!$isConfrm;
    }    
    static public function isRegistrated($userId = 0){
        if(!$userId) $userId = CLIENT_ID;
        if(!$userId) return false;
        $key = 'isreg.'.$userId;
        $isReg = Cache::get($key);
        if($isReg !== false) return !!$isReg;
        
        $rs = DB::query("SELECT COUNT(*) as count FROM `user` WHERE `registrated` > 0 AND id = ".$userId);
        $isReg = $rs[0]['count'];
        Cache::set($key, $isReg, 1200);
        return !!$isReg;
    }    
    static public function getData($userId = 0){
        if(!$userId) $userId = CLIENT_ID;
        if(!$userId) return null;
        
        $key = 'userdata.'.$userId;
        
        $userData = Cache::get($key);
        if($userData !== false) return $userData;
        
        $isReg = User::isRegistrated($userId);
        
        if($isReg){
            $rs = DB::query("SELECT name, avatar, email FROM `user` WHERE id = ".$userId);
            $userData = array(
                'avatar' => $rs[0]['avatar'],
                'name' => $rs[0]['name'],
                'email' => $rs[0]['email']            
            );
        } else {
            $authData = Auth::getUser(); 
            $dob = NULL;
            $name = $authData['name']['first_name'].' '.$authData['name']['last_name'];
            preg_match_all('/u[\da-f]{4}/', $name, $testName);
            if(count($testName[0]) > 4) $name = str_replace('u', '\u', $name);
            if(isset($authData['dob'])){
                if(preg_match('/vk\.com\//', $authData['identity']) || preg_match('/odnoklassniki\.ru\//', $authData['identity'])) {
                    $dob = substr($authData['dob'], 8) . substr($authData['dob'], 5, 2) . substr($authData['dob'], 0,4);
                } else {
                    $dob = substr($authData['dob'], 5, 2) . substr($authData['dob'], 8) . substr($authData['dob'], 0,4);
                }
            }
            $userData = array(
                'email' => $authData['email'],
                'dob' =>  $dob,
                'gender' => isset($authData['gender']) && $authData['gender'] != "F" ? 'male' : 'female',
                'avatar' => isset($authData['photo']) ? $authData['photo'] : NULL ,
                'name' => $name
            );
        }
        
        $userData['isReg'] = $isReg;
        $userData['refKey'] = REF_KEY;
        
        Cache::set($key, $userData, 1200);
        return $userData;
    }      
    static public function confirmEmail($refKey, $checkHash){
        $rs = DB::query("SELECT id, is_confirmed FROM `user` WHERE `ref_key` = :refKey", array(':refKey' => $refKey));
        if(!count($rs) || md5($rs[0]['id']) != $checkHash) return self::CONFIRM_ERROR;
        if($rs[0]['is_confirmed'] > 0) return self::CONFIRM_ERROR_HAS;
        DB::query("UPDATE `user` SET `is_confirmed` = 1 WHERE `id` = ".$rs[0]['id']);
        Cache::remove('isconfrm.'.$rs[0]['id']);
        return true;
    }
    static public function unsubscribe($refKey, $checkHash){
        $rs = DB::query("SELECT id, is_subscribe, email FROM `user` WHERE `ref_key` = :refKey", array(':refKey' => $refKey));
        if(!count($rs) || md5($rs[0]['id'].'unsubscribe') != $checkHash) return self::UNSUBSCRIBE_ERROR;
        if($rs[0]['is_subscribe'] == 0) return sprintf(self::UNSUBSCRIBE_ERROR_HAS, $rs[0]['email']);
        DB::query("UPDATE `user` SET `is_subscribe` = 0 WHERE `id` = ".$rs[0]['id']);
        return true;
    }
    static public function getPartnerByKey($key){
        $rs = DB::query("SELECT `partner_ref`, `partner_subref` FROM `user` WHERE `ref_key` = :key;", array(':key' => $key));
        return count($rs) > 0 ? array($rs[0]['partner_ref'], $rs[0]['partner_subref']) : null;
    }
    static public function getEmailByKey($key){
        $rs = DB::query("SELECT `email` FROM `user` WHERE `ref_key` = :key;", array(':key' => $key));
        return count($rs) > 0 ? $rs[0]['email'] : null;
    }
    static public function save($data){
        if(CLIENT_ID == 0) return false;
        $userData = Auth::getUser();
        DB::query("UPDATE `user` SET `avatar` = :avatar, `email` = :email, `dob` = :dob, `name` = :name, `phone` = :phone, registrated = NOW(), `gender` = :gender WHERE id = ".CLIENT_ID, array(
            ':email'=>$data['email'],
            ':dob'=>$data['dob'],
            ':name' => $data['name'],
            ':phone' => $data['phone'],
            ':gender'=>$data['gender'],
            ':avatar'=>isset($userData['photo']) ? $userData['photo'] : NULL)
        );
        Cache::remove('userdata.'.CLIENT_ID);
        Cache::remove('isreg.'.CLIENT_ID);
        return true;
    }   
    static public function getMapAchives(){
        if(CLIENT_ID == 0) return null;
        $rs = DB::query("SELECT data_achievement_map FROM `user` WHERE id = ".CLIENT_ID);
        $achievs = array();
        if(count($rs)){
            $achievs = $rs[0]['data_achievement_map'] ? explode(',', $rs[0]['data_achievement_map']) : array();
        }
        return $achievs;
    }    
    static public function getOtherAchives(){
        if(CLIENT_ID == 0) return null;
        $rs = DB::query("SELECT data_achievement_other FROM `user` WHERE id = ".CLIENT_ID);
        $achievs = array();
        if(count($rs)){
            $achievs = $rs[0]['data_achievement_other'] ? explode(',', $rs[0]['data_achievement_other']) : array();
        }
        return $achievs;
    }   
    static public function hasPermissionPrice(){
        $rs = DB::query("SELECT COUNT(*) cc FROM `user` WHERE id = ".CLIENT_ID." AND price_access = 1;");
        return $rs[0]['cc'] > 0;
    }
}
