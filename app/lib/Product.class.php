<?php

require_once __DIR__.'/DB.class.php';
require_once __DIR__.'/Cache.class.php';

class Product {
    protected static $FILTERS = array(
        'f.price' => array(
            array(
                'text' => 'Любая',
                'value' => null
            ),
            array( 
                'text' => 'до 5 000<span class="g-ruble">p</span>',
                'value' => '-5000'
            ),
            array( 
                'text' => '5 000 — 15 000<span class="g-ruble">p</span>',
                'value' => '5000-15000'
            ),
            array( 
                'text' => 'свыше 15 000<span class="g-ruble">p</span>',
                'value' => '15000-'
            )           
        ),
        'f.discount' => array(
            array(
                'text' => 'Любая',
                'value' => null
            ),
            array( 
                'text' => 'до 30%',
                'value' => '-30'
            ),
            array( 
                'text' => '30% — 50%',
                'value' => '30-50'
            ),
            array( 
                'text' => 'более 50%',
                'value' => '50-'
            )        
        )
    );
    static public function getParamsFrom(&$data){
    
        $category = isset($data['c']) ? $data['c'] : 'home';
        $limit = 24;
        $page = isset($data['p']) ? $data['p'] : 0;
        $offset = $page * $limit;
        $order = isset($data['s']) ? $data['s'] : 'id';
        $filterValues = array(
            'f.price' => isset($data['f_price']) ? $data['f_price'] : null,
            'f.discount' => isset($data['f_discount']) ? $data['f_discount'] : null,
        );
        
        return array(
            'category' => $category,
            'limit' => $limit,
            'offset' => $offset,
            'order' => $order,
            'filters' => $filterValues
        );
    }
    static public function getFilters($params){
        $filters = self::$FILTERS;
        $filterValues = $params['filters'];
        foreach($filters as $filterName => $filterItems){
            foreach($filterItems as $key => $item){
                $params['filters'] = array_merge($filterValues, array(
                    $filterName => $item['value']    
                ));
                $filters[$filterName][$key]['total'] = Product::getTotalItems($params);
            }    
        }
        return $filters;
    }
    static public function getTotalItems($params){
        $category = $params['category'];
        $filters = $params['filters'];
        $key = "goods.total.$category";
        foreach(self::$FILTERS as $filterName => $filter){
            $key .= ".".(isset($filters[$filterName]) ? $filterName.$filters[$filterName] : null);
        }        
        $total = Cache::get($key);
        if($total !== false){
            return $total;
        }
        $filtersForQ = self::applyFiltersForQ($filters);         
        $rs = DB::query("SELECT COUNT(*) cc FROM goods WHERE `category` = :category {$filtersForQ[0]}", array_merge(array(
            ':category' => $category
        ), $filtersForQ[1]));
        $total = (int)$rs[0]['cc'];
        Cache::set($key, $total, 600);
        return $total;
    }
    static public function applyFiltersForQ($filters){
        $filtersQ = '';
        $filtersQP = array();
        foreach(self::$FILTERS as $filterName => $filter){
            $value = isset($filters[$filterName]) ? $filters[$filterName] : null;
            if($value !== NULL) {
                if($filterName == 'f.price') {
                    $value = explode('-', $value);
                    if($value[0]) {
                        $filtersQ .= " AND price > :priceFrom ";
                        $filtersQP[':priceFrom'] = (int)$value[0];
                    }
                    if($value[1]) {
                        $filtersQ .= " AND price <= :priceTo ";
                        $filtersQP[':priceTo'] = (int)$value[1];
                    }
                } else if($filterName == 'f.discount') {
                    $value = explode('-', $value);
                    if($value[0]) {
                        $filtersQ .= " AND discount > :discountFrom ";
                        $filtersQP[':discountFrom'] = (int)$value[0];
                    }
                    if($value[1]) {
                        $filtersQ .= " AND discount <= :discountTo ";
                        $filtersQP[':discountTo'] = (int)$value[1];
                    }
                }          
            }
        }
        return array($filtersQ, $filtersQP);        
    }
    static public function getItems($params, $isPromo = false){
    
        $category = $params['category'];
        $filters = $params['filters'];
        $order = $params['order'];
        $limit = $params['limit'];     
        $offset = $params['offset']; 
        
        $key = "goods.$category.'.o'.$order.'.l'.$limit.'.ofs'.$offset";
        foreach(self::$FILTERS as $filterName => $filter){
            $key .= ".".(isset($filters[$filterName]) ? $filterName.$filters[$filterName] : null);
        }
        $rs = Cache::get($key);
        if($rs !== false){
            return $isPromo ? $rs : self::_removePromo($rs);
        }
        $filtersForQ = self::applyFiltersForQ($filters);
        $q = "SELECT title, url, img, sub_name subName, sub_url subUrl, price, oldprice oldPrice, category, ratio, saled, `closed` FROM goods WHERE `category` = :category {$filtersForQ[0]} ORDER BY :order LIMIT ".((int)$limit)." OFFSET ".((int)$offset).";";
        $rs = DB::query($q, array_merge(array(
            ':category' => $category,
            ':order' => $order
        ), $filtersForQ[1]));
        $data = array();
        foreach($rs as $item){
            $data[] = array(
                'title' => $item['title'],
                'url' => $item['url'],
                'img' => $item['img'], 
                'subName' => $item['subName'], 
                'subUrl' => $item['subUrl'], 
                'price' => (int)$item['price'], 
                'oldPrice' => $item['oldPrice'],
                'category' => $item['category'],
                'ratio' => (float)$item['ratio'],
                'closed' => (int)$item['closed'] > 0,
                'saled' => (int)$item['saled'] > 0
            );
        }
        Cache::set($key, $data, 600);
        return $isPromo ? $data : self::_removePromo($data);
    }
    static private function _removePromo(&$data){
        foreach($data as $k=>$item){
            if(preg_match('/coupon=sale/', $item['url'])) continue;
            $data[$k]['url'] = preg_replace('/.coupon=[\w\d]+/', '', $item['url']);
        }
        return $data;
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
                'ratio'=>1
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
                'ratio'=>1
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
                'ratio'=>1
            )
        );
    }
}
