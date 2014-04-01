<?php

require_once __DIR__.'/../lib/DB.class.php';
require_once __DIR__.'/../lib/Cache.class.php';

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
    $saled = $itemNode->attributes->getNamedItem('saled')->textContent == 'true';
    if(!$available) continue;
    $itemData = nodeToArray($itemNode);
    if(!isset($itemData['oldprice']) || $itemData['currencyId']['value'] != 'RUR' || !isset($itemData['promo']['value'])) {
        var_dump('Error in '.$itemData['url']['value'], $itemData['oldprice'], $itemData['currencyId']['value'], $itemData['promo']['value']);
        continue;
    }
    $params = array(
        ':url' => $itemData['url']['value'].(isset($itemData['promo']['value']) ? '?coupon='.$itemData['promo']['value'] : ''),
        ':title' =>	$itemData['name']['value'],
        ':img' => $itemData['picture']['value'],
        ':subName' => $categories[$itemData['categoryId']['value']]['title'],
        ':subUrl' => $categories[$itemData['categoryId']['value']]['url'],
        ':price' => (int)$itemData['price']['value'],
        ':oldprice' => (int)$itemData['oldprice']['value'],
        ':category' => 'home',
        ':discount' => (1 - (int)$itemData['price']['value'] / (int)$itemData['oldprice']['value']) * 100,
        ':ratio' =>	(int)$itemData['picture']['attrs']['width'] / (int)$itemData['picture']['attrs']['height'],
        ':saled' => $saled ? 1 : 0
    );
    DB::update('INSERT INTO `goods` (url, title, img, sub_name, sub_url, price, oldprice, category, discount, ratio, saled) VALUES (:url, :title, :img, :subName, :subUrl, :price, :oldprice, :category, :discount, :ratio, :saled)', $params);
}

Cache::clear();

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