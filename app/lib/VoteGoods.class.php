<?php

require_once __DIR__.'/Auth.class.php';
require_once __DIR__.'/DB.class.php';

class VoteGoods {
    static public function getItems(){
        $handle = fopen(__DIR__.'/../votegoods.csv', "r");
        $data = array();
        $rowCounter = 0;
        $items = array();
        $result = array();
        while (($line = fgetcsv($handle, 0)) !== FALSE) {
            if(!$rowCounter++ || !(int)$line[0]) continue;
            $id = trim($line[2]);
            $item = array(
                'id' => $id,
                'title' => trim($line[3]),
                'url' => trim($line[7]),
                'subName' => trim($line[1]),
                'price' => (int)preg_replace('/\s/', '', $line[5]),
                'oldPrice' => (int)preg_replace('/\s/', '', $line[4]),
                'quantity' => (int)preg_replace('/\s/', '', $line[6]),
                'votes' => 0
            );
            $items[$id] = $item;
        }
        fclose($handle);
        $rs = DB::query("SELECT `uid`, COUNT(`uid`) cc FROM votegoods WHERE `uid` IN ('".implode("','", array_keys($items))."') GROUP BY `uid`;");
        foreach($rs as $row){
            $items[$row['uid']]['quantity'] += floor($row['cc'] / 100);
            $items[$row['uid']]['votes'] = $row['cc'];
        }
        foreach($items as $item){
            $result[] = $item;
        }
        return $result;
    }
    static public function getVoted(){
        $userId = CLIENT_ID > 0 ? CLIENT_ID : $_COOKIE[SESSION_COOKIE.'_stmuid'];
        $rs = DB::query("SELECT `uid` FROM votegoods WHERE `user_id` = :userId ;", array(':userId' => $userId));
        $voted = array();
        foreach($rs as $row){
            $voted[] = $row['uid'];
        }
        return $voted;
    }
    static public function vote($uid){
        $userId = CLIENT_ID > 0 ? CLIENT_ID : $_COOKIE[SESSION_COOKIE.'_stmuid'];
        $rs = DB::query("SELECT COUNT(*) cc FROM `votegoods` WHERE user_id = :userId AND uid = :uid", array(
            ':userId' => $userId,
            ':uid' => $uid
        ));
        if($rs[0]['cc'] > 0) return;
        DB::update("INSERT INTO `votegoods` (user_id, uid) VALUES (:userId, :uid);", array(
            ':userId' => $userId,
            ':uid' => $uid
        ));
    }
}