<?php

require_once __DIR__.'/../lib/DB.class.php';

DB::query('TRUNCATE TABLE `goods`;');

$STMXML = 'http://xml.sotmarket.ru/xml/hidden2/g_sochi.xml';

$categories = array();

$doc = new DOMDocument();
$doc->load($STMXML);
$items = $doc->getElementsByTagName ('category');
foreach($items as $itemNode){
    $attrsNodeL = $itemNode->attributes;
    $urlNode = $attrsNodeL->getNamedItem('url');
    $categories[$attrsNodeL->getNamedItem('id')->textContent] = array(
        'title' => $itemNode->textContent,
        'url' => $urlNode ? $urlNode->textContent : ''
    );
}
$items = $doc->getElementsByTagName ('offer');
foreach($items as $itemNode){
    $available = $itemNode->attributes->getNamedItem('available')->textContent == 'true';
    if(!$available) continue;
    $itemData = nodeToArray($itemNode);
    if(!isset($itemData['oldprice']) || $itemData['currencyId']['value'] != 'RUR') continue;
    $params = array(
        ':url' => $itemData['url']['value'],
        ':title' =>	$itemData['name']['value'],
        ':img' => $itemData['picture']['value'],
        ':subName' => $categories[$itemData['categoryId']['value']]['title'],
        ':subUrl' => $categories[$itemData['categoryId']['value']]['url'],
        ':price' => (int)$itemData['price']['value'],
        ':oldprice' => (int)$itemData['oldprice']['value'],
        ':category' => 'home',
        ':discount' => (int)$itemData['oldprice']['value'] - (int)$itemData['price']['value'],
        ':ratio' =>	(int)$itemData['picture']['attrs']['width'] / (int)$itemData['picture']['attrs']['height']
    );
    DB::update('INSERT INTO `goods` (url, title, img, sub_name, sub_url, price, oldprice, category, discount, ratio) VALUES (:url, :title, :img, :subName, :subUrl, :price, :oldprice, :category, :discount, :ratio)', $params);
}

function nodeToArray($itemNode){
    $itemData = array();
    foreach($itemNode->childNodes as $dataNode){
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
