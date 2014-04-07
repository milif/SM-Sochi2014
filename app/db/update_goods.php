<?php

require_once __DIR__.'/../lib/DB.class.php';
require_once __DIR__.'/../lib/Cache.class.php';

DB::query('TRUNCATE TABLE `goods`;');

updateSotmarket();
updateQuelle();
updateProskater();

Cache::clear();

function updateSotmarket(){
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
}
function updateProskater(){
    $STMXML = 'http://www.proskater.ru/market-sotmarket-games.yml';

    $categories = array();

    $doc = new DOMDocument();
    $doc->load($STMXML);
    $items = $doc->getElementsByTagName ('category');
    foreach($items as $itemNode){
        $attrsNodeL = $itemNode->attributes;
        $urlNode = $attrsNodeL->getNamedItem('url');
        $categories[$attrsNodeL->getNamedItem('id')->textContent] = array(
            'title' => $itemNode->textContent,
            'url' => $urlNode ? $urlNode->textContent : null
        );
    }
    $items = $doc->getElementsByTagName ('offer');
    $count = 0;
    foreach($items as $itemNode){
        if($count++ == 500) break;
        $available = $itemNode->attributes->getNamedItem('available')->textContent == 'true';
        //$saled = $itemNode->attributes->getNamedItem('saled')->textContent == 'true';
        if(!$available) continue;
        $itemData = nodeToArray($itemNode);
        //if(!isset($itemData['oldprice'])) continue;
        $params = array(
            ':url' => $itemData['url']['value'],
            ':title' =>	$itemData['name']['value'],
            ':img' => $itemData['picture']['value'],
            ':subName' => $categories[$itemData['categoryId']['value']]['title'],
            ':subUrl' => $categories[$itemData['categoryId']['value']]['url'],
            ':price' => (int)$itemData['price']['value'],
            ':oldprice' => isset($itemData['oldprice']) ? (int)$itemData['oldprice']['value'] : null,
            ':category' => 'sport',
            ':discount' => isset($itemData['oldprice']) ? (1 - (int)$itemData['price']['value'] / (int)$itemData['oldprice']['value']) * 100 : 0,
            ':ratio' =>	(int)$itemData['picture']['attrs']['width'] / (int)$itemData['picture']['attrs']['height'],
            ':saled' => 0
        );
        DB::update('INSERT INTO `goods` (url, title, img, sub_name, sub_url, price, oldprice, category, discount, ratio, saled) VALUES (:url, :title, :img, :subName, :subUrl, :price, :oldprice, :category, :discount, :ratio, :saled)', $params);
    }
}
function updateQuelle(){
    $XML = array(
        'http://www.quelle.ru/nws_exports/sotmarket/productfeed_sotmarket_sale_quelle_ru_ru.xml',
        'http://www.quelle.ru/nws_exports/sotmarket/productfeed_sotmarket_quelle_ru_ru.xml'        
    );
    
    foreach($XML as $_xml) _updateQuelle($_xml);
}
function _updateQuelle($STMXML){
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
    $count = 0;
    foreach($items as $itemNode){
        if($count++ == 500) break;
        $available = $itemNode->attributes->getNamedItem('available')->textContent == 'true';
        //$saled = $itemNode->attributes->getNamedItem('saled')->textContent == 'true';
        //if(!$available) continue;
        $itemData = nodeToArray($itemNode);
        if(!isset($itemData['picture'])) continue;
        $params = array(
            ':url' => $itemData['url']['value'].(isset($itemData['promo']['value']) ? '?coupon='.$itemData['promo']['value'] : ''),
            ':title' =>	preg_replace('/[\s\.]+/', '', $itemData['model']['value']),
            ':img' => preg_replace('/_w\d+_h\d+/', '_w197_h205', $itemData['picture']['value']),
            ':subName' => $categories[$itemData['categoryId']['value']]['title'],
            ':subUrl' => '',
            ':price' => (int)$itemData['price']['value'],
            ':oldprice' => isset($itemData['oldprice']) ? (int)$itemData['oldprice']['value'] : NULL,
            ':category' => 'clothing',
            ':discount' => isset($itemData['oldprice']) ? (1 - (int)$itemData['price']['value'] / (int)$itemData['oldprice']['value']) * 100 : 0,
            ':ratio' =>	NULL,
            ':saled' => 0
        );
        DB::update('INSERT INTO `goods` (url, title, img, sub_name, sub_url, price, oldprice, category, discount, ratio, saled) VALUES (:url, :title, :img, :subName, :subUrl, :price, :oldprice, :category, :discount, :ratio, :saled)', $params);
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
