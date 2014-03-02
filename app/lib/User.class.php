<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/Cache.class.php';

class User {
    const CONFIRM_ERROR = 'Ошибка при подтверждении адреса электронной почты.';
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
            $rs = DB::query("SELECT name, avatar FROM `user` WHERE id = ".$userId);
            $userData = array(
                'avatar' => $rs[0]['avatar'],
                'name' => $rs[0]['name']                
            );
        } else {
            $authData = Auth::getUser();        
            $userData = array(
                'email' => $authData['email'],
                'dob' => isset($authData['dob']) ? substr($authData['dob'], 8) . substr($authData['dob'], 5, 2) . substr($authData['dob'], 0,4) : NULL,
                'gender' => isset($authData['gender']) && $authData['gender'] != "F" ? 'male' : 'female',
                'avatar' => isset($authData['photo']) ? $authData['photo'] : NULL ,
                'name' => $authData['name']['first_name'].' '.$authData['name']['last_name']
            );
        }
        
        $userData['isReg'] = $isReg;
        $userData['refKey'] = REF_KEY;
        
        Cache::set($key, $userData, 1200);
        return $userData;
    }      
    static public function confirmEmail($refKey, $checkHash){
        $rs = DB::query("SELECT id FROM `user` WHERE `ref_key` = :refKey", array(':refKey' => $refKey));
        if(!count($rs) || md5($rs[0]['id']) != $checkHash) return self::CONFIRM_ERROR;
        DB::query("UPDATE `user` SET `is_confirmed` = 1 WHERE `id` = ".$rs[0]['id']);
        return true;
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
}
