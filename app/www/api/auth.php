<?php
require_once __DIR__.'/../../lib/LoginzaAPI.class.php';

if($_POST['token']) {
  $loginza = new LoginzaAPI;
  $userInfo = str_replace("'","",json_encode($loginza->getAuthInfo($_POST['token'])));
  echo "
    <script type=\"text/javascript\">
    // <![CDATA[
      window.parent.location.hash='{$_POST['token']}';
      window.parent._{$_POST['token']} = JSON.parse('$userInfo');
    // ]]>
    </script>
  ";
}
