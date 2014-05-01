<?php 
    require_once __DIR__.'/../../config.php';
    header("Location: ".APP_ROOT_URL."/sale/"); exit;

    require_once __DIR__.'/../../lib/DB.class.php';
    require_once __DIR__.'/../../lib/Product.class.php';
    require_once __DIR__.'/../../lib/Auth.class.php';
    require_once __DIR__.'/../../lib/User.class.php';
    require_once __DIR__.'/../../lib/Achiev.class.php';
    require_once __DIR__.'/../../lib/Game.class.php';
    
    $params = Product::getParamsFrom($_GET);
    $filters = Product::getFilters($params);
    
    $score = 0;
    $countAchievs = 0; 
    
    if(CLIENT_ID && isset($_GET['d']) && md5(CLIENT_ID.'price') == $_GET['d']) {
        DB::update("UPDATE `user` SET price_access = 1 WHERE id = ".CLIENT_ID." AND price_access = 0;");
    }
    
    $hasPermission = User::hasPermissionPrice();
    
    if((time() > strtotime("2014-04-30 00:00:00 Europe/Moscow") || isset($_GET['disablechecktime'])) && !$hasPermission && CLIENT_ID > 0) {
        
        $gameData = Game::getUserData();
        $achievsBonus = Achiev::getAchievsBonus();
        $achievs = array_merge(User::getMapAchives(), User::getOtherAchives());
        $isSber = false;
        $countAchievs += count($achievs);
        foreach($gameData as $game){
            $isSber = isset($game['data']['score']) && isset($game['data']['score']['sber']) && (int)$game['data']['score']['sber'] >= 200;
            $score += $game['score'];
            $countAchievs += count($game['achievements']);
        }
        foreach($achievs as $achiev){
            if(isset($achievsBonus[$achiev])) $score += $achievsBonus[$achiev];
        }
        
        $hasPermission = ($score >= 5000 || $countAchievs >= 9);

        if($hasPermission) {
            DB::update("UPDATE `user` SET price_access = 1 WHERE id = ".CLIENT_ID." AND price_access = 0;");
        }        
    }
       

    $ENV = array(
        'userData' => array(
            'score' => $score,
            'achievs' => $countAchievs
        ),
        'hasPermission' => $hasPermission,
        'goods' => array(
            'filters' => $filters,
            'items' => array(
                'data' => Product::getItems($params, $hasPermission),
                'total' => (int)Product::getTotalItems($params)
            ),
            'params' => $params
        )
    );
    
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmIndex" lang="ru">
<head>
  <title>Сочные Цены — Сочные игры 2014</title>
  <link rel="stylesheet" href="index.css" type="text/css"/>
  <base href="<?php echo APP_ROOT_URL.'/'; ?>" />
  <!-- @include stmIndexPrice -->
  <?php echo $head; ?>
</head>
<body stm-index-sochi-price stm-preload></body>
</html>
