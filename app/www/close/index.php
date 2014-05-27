<?php 
    require __DIR__.'/../../lib/init.php'; ?><!doctype html>
<html ng-app="stmSochiClose" lang="ru">
<head>
  <title>Сочные игры</title>
  <base href="<?php echo APP_ROOT_URL.'/'; ?>"></base>
  <!-- @include stmSochiClose -->
  <link rel="shortcut icon" href="favicon.ico"/>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1024">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">
</head>
<body ng-controller="closePage" stm-preload class="l-body">
<!-- l-page -->
<div class="l-page-splash">
    <div class="l-page-splash__h">
        <div class="splash">
            <a class="splash__sotmarket" href="/">Sotmarket.ru</a>
            <div class="splash__title"></div>

            <div class="splash__text">
                <p>Сочные игры это атомистика, по определению, индуктивно подчеркивает знак, ломая рамки привычных представлений. Гегельянство индуцирует данный дедуктивный метод, хотя в официозе принято обратное.</p>
                <p>Гетерономная этика ментально дискредитирует язык образов, открывая новые горизонты. Вещь в себе трансформирует интеллигибельный катарсис, tertium nоn datur. Заблуждение, как принято считать, трогательно наивно.</p>
            </div>

            <div class="splash__envelop">
                <div class="splash__envelop-h">
                    <div ng-if="state == 'send'" class="splash__envelop-subscribe">
                        <div class="splash__envelop-mail"></div>
                        <div class="splash__envelop-note">Хотите знать обо всех проектах Сотмаркета?</div>
                        <div class="splash__envelop-title">Подпишитесь, и узнаете первыми</div>

                        <form name="model.form" class="splash__envelop-form g-form" ng-submit="submit()" novalidate>
                            <div class="splash__envelop-form-row">
                                <div class="splash__envelop-form-bl">
                                    <input name="email" placeholder="Электронная почта" ng-model="model.email" required type="email" class="splash__envelop-form-input">
                                    <button ng-class="isSend ? 'state_loading' : ''" type="submit" class="splash__envelop-form-button">подписаться</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div ng-if="state == 'sended'" class="splash__envelop-subscribe">
                        <div class="splash__envelop-access"></div>
                        <div class="splash__envelop-note">Спасибо!</div>
                        <div class="splash__envelop-title">Вы успешно подписаны</div>
                    </div>
                </div>
            </div>
            <div class="splash__copyright">© Сотмаркет 2005–2014</div>
        </div>
    </div>
</div>
<!-- // l-page -->   
</body>
</html>
