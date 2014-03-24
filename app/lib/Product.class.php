<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Cache.class.php';

class Product {
    static public function getTotalItems($category){
        $key = "goods.$category";
        $total = Cache::get($key);
        if($total !== false){
            return $total;
        }
        $rs = DB::query("SELECT COUNT(*) cc FROM goods WHERE `category` = :category", array(
            ':category' => $category
        ));
        $total = (int)$rs[0]['cc'];
        Cache::set($key, $total);
        return $total;
    }
    static public function getItems($category, $order = 'id', $limit, $offset = 0){
        $key = "goods.$category.$order.$limit.$offset";
        $rs = Cache::get($key);
        if($rs !== false){
            return $rs;
        }
        $rs = DB::query("SELECT title, url,	img, sub_name subName, sub_url subUrl, price, oldprice oldPrice, category FROM goods WHERE `category` = :category ORDER BY :order LIMIT ".((int)$limit)." OFFSET ".((int)$offset).";", array(
            ':category' => $category,
            ':order' => $order
        ));
        Cache::set($key, $rs);
        return $rs;
    }
    static public function getSale(){ 
        return array(
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mp3_pleer/apple/f01_apple_ipod_touch_5g_5.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mp3_player.html',
                'subName'=>'MP3 плееры',
                'title'=>'Apple iPod touch 5G 32GB',
                'url'=>'http://www.sotmarket.ru/product/apple-ipod-touch-5g-32gb.html',
                'oldPrice'=>12990,
                'price'=>7990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mp3_pleer/apple/f01_apple_ipod_nano_7g_1.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mp3_player.html',
                'subName'=>'MP3 плееры',
                'title'=>'Apple iPod nano 7G 16GB',
                'url'=>'http://www.sotmarket.ru/product/apple-ipod-nano-16gb.html',
                'oldPrice'=>6960,
                'price'=>3490,
                'modImg'=>'mod_hor'
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mp3_pleer/apple/f01_apple_ipod_touch_5g_5.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mp3_player.html',
                'subName'=>'MP3 плееры',
                'title'=>'Apple iPod touch 5G 16GB',
                'url'=>'http://www.sotmarket.ru/product/apple-ipod-touch-5g-16gb.html',
                'oldPrice'=>9320,
                'price'=>4990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/telefony/mobiles/apple-iphone-5.jpg',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Apple iPhone 5 16GB',
                'url'=>'http://www.sotmarket.ru/product/apple-iphone-5-16gb.html',
                'oldPrice'=>23790,
                'price'=>12490
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/telefony/mobiles/apple-iphone-5.jpg',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Apple iPhone 5 32GB',
                'url'=>'http://www.sotmarket.ru/product/apple-iphone-5-32gb.html',
                'oldPrice'=>28020,
                'price'=>19990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/planshetnie_pc/apple/apple_ipad_wi_fi_16gb_3.jpg',
                'subUrl'=>'http://www.sotmarket.ru/category/planshet.html',
                'subName'=>'Планшеты',
                'title'=>'Apple iPad Wi-Fi 32GB',
                'url'=>'http://www.sotmarket.ru/product/netbook_apple_ipad_32gb.html',
                'oldPrice'=>15890,
                'price'=>8990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/planshetnie_pc/apple/f03_apple_ipad_mini_wi_fi.png',
                'subUrl'=>'http://www.sotmarket.ru/category/planshet.html',
                'subName'=>'Планшеты',
                'title'=>'Apple iPad mini Wi-Fi 16GB',
                'url'=>'http://www.sotmarket.ru/product/apple-ipad-mini-wi-fi-16gb.html',
                'oldPrice'=>12910,
                'price'=>6990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mobile/samsung/f03_samsung_galaxy_s3_i9300_2.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Samsung Galaxy S3 i9300 16GB Marble White',
                'url'=>'http://www.sotmarket.ru/product/samsung-galaxy-s3-gt-i9300.html',
                'oldPrice'=>13630,
                'price'=>7990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/igrovie_pristavki/sony/sony-playstation-4-1.png',
                'subUrl'=>'http://www.sotmarket.ru/category/igrovie_pristavki.html',
                'subName'=>'Игровые приставки',
                'title'=>'Sony PlayStation 4',
                'url'=>'http://www.sotmarket.ru/product/sony-playstation-4.html',
                'oldPrice'=>26990,
                'price'=>14990,
                'modImg'=>'mod_hor'
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/igrovie_pristavki/microsoft/f03_microsoft_xbox_360_250gb_1.png',
                'subUrl'=>'http://www.sotmarket.ru/category/igrovie_pristavki.html',
                'subName'=>'Игровые приставки',
                'title'=>'Microsoft Xbox 360 250GB',
                'url'=>'http://www.sotmarket.ru/product/microsoft-xbox-360-250gb-halo-4-kod-tomb-raider-1m-live.html',
                'oldPrice'=>10980,
                'price'=>5990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mobile/mobile/samsung-galaxy-s4-mini-i9190-0-2.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Samsung Galaxy S4 mini i9190',
                'url'=>'http://www.sotmarket.ru/product/samsung-galaxy-s4-mini-i9190.html',
                'oldPrice'=>14990,
                'price'=>9990
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mobile/nokia/f03_nokia_lumia_920.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Nokia Lumia 920',
                'url'=>'http://www.sotmarket.ru/product/nokia-lumia-920.html',
                'oldPrice'=>14390,
                'price'=>9490
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mobile/nokia/f03_nokia_lumia_920.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Nokia Lumia 920',
                'url'=>'http://www.sotmarket.ru/product/nokia-lumia-920.html',
                'oldPrice'=>14390,
                'price'=>9490
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/mobile/nokia/f03_nokia_lumia_820.png',
                'subUrl'=>'http://www.sotmarket.ru/category/mobiles.html',
                'subName'=>'Мобильные телефоны',
                'title'=>'Nokia Lumia 820',
                'url'=>'http://www.sotmarket.ru/product/nokia-lumia-820.html',
                'oldPrice'=>12490,
                'price'=>9490
            ),
            array(
                'img'=>'http://img-sotmarket.ru/standart/img/notebook/apple/apple-macbook-air-11-mid-2013-md712-1-3.png',
                'subUrl'=>'http://www.sotmarket.ru/category/notebook.html',
                'subName'=>'Ноутбуки',
                'title'=>'Apple MacBook Air 13" Mid 2013 MD760',
                'url'=>'http://www.sotmarket.ru/product/apple-macbook-air-13-mid-2013-md760.html',
                'oldPrice'=>43560,
                'price'=>19990,
                'modImg'=>'mod_hor'
            )
        );
    }
}
