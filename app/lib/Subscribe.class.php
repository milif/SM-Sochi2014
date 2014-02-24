<?php

require_once __DIR__.'/DB.class.php';

class Subscribe {
    static public function add($email){ 
        DB::query("INSERT INTO subscribe (email) VALUES (:email);", array(":email" => $email));
        return true;
    }
}
