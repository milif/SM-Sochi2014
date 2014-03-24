<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Auth.class.php';

class Code {
    const ERROR_CODE = "Введённый код неверен";
    const ERROR_USED = "Введённый код использован";
    static public function usecode($code){
    
        if(CLIENT_ID == 0) return false;
        $rs = DB::query("SELECT id, user_id, achievs FROM code WHERE `code` = :code", array(":code" => $code));
        
        if(!count($rs)) return self::ERROR_CODE;
        if($rs[0]['user_id']) return self::ERROR_USED;
        
        $achievs = explode(',', $rs[0]['achievs']);
        foreach($achievs as $k=>$achiev){
            $achievs[$k] = trim($achiev);
            Achiev::add($achievs[$k]);
        }
        
        DB::query("UPDATE code SET `used_at` = NOW(), `user_id` = ".CLIENT_ID." WHERE id = {$rs[0]['id']}");
        
        return array(
            'achievs' => $achievs
        );
    }
}
