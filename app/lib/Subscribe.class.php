<?php

require_once __DIR__.'/DB.class.php';

class Subscribe {
    static public function add($email){ 
        DB::query("INSERT INTO subscribe (email, partner_ref, partner_subref) VALUES (:email, :partnerRef, :partnerSubref);", array(":email" => $email, ':partnerRef'=>$_COOKIE['partner'], ':partnerSubref'=>$_COOKIE['subref']));
        return true;
    }
}
