<?php

require_once __DIR__.'/../lib/DB.class.php';
require_once __DIR__.'/../lib/Cache.class.php';

updateSotmarket();

function updateSotmarket(){
    $XML = array(
        'http://xml.sotmarket.ru/xml/hidden2/g_sochi_closed.xml'   
    );
    
    foreach($XML as $_xml) _updateSotmarket($_xml);
}
function _updateSotmarket($STMXML){

    $doc = new DOMDocument();
    $doc->load($STMXML);

    $items = $doc->getElementsByTagName ('offer');
    foreach($items as $itemNode){
        $saled = $itemNode->attributes->getNamedItem('saled')->textContent == 'true';
        $itemData = nodeToArray($itemNode);
        if($saled) {
            
            DB::update('UPDATE goods SET `saled` = 1 WHERE url = :url', array(
                ':url' => $itemData['url']['value'].(isset($itemData['promo']['value']) && isset($itemData['oldprice']) ? '?coupon='.$itemData['promo']['value'] : '')
            ));
        }
    }
}

function nodeToArray($itemNode){
    $itemData = array();
    foreach($itemNode->childNodes as $dataNode){
        if(isset($itemData[$dataNode->localName])) continue;
        $attrs = array();
        if($dataNode->attributes) foreach($dataNode->attributes as $attrNode){
            $attrs[$attrNode->localName] = $attrNode->textContent;
        }
        $itemData[$dataNode->localName] = array(
            'value' => $dataNode->textContent,
            'attrs' => $attrs
        );        
    }
    return $itemData;
}