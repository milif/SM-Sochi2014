<?php

require_once __DIR__.'/../../lib/Auth.class.php';
require_once __DIR__.'/../../lib/User.class.php';

if(isset($_GET['logout']) && $_GET['logout']){
    echo json_encode(array('success'=>Auth::logout()));
    exit;
}

require_once __DIR__.'/../../lib/LoginzaAPI.class.php';
if($_POST['token']) {
  $loginza = new LoginzaAPI;
  $userDataJson = json_encode($loginza->getAuthInfo($_POST['token']));
  $userData = json_decode($userDataJson, true);
  $userId = Auth::login(md5(uniqid(null, true)), $userData['identity'], $userData);
  if(!$userId) exit();
  $userData = User::getData($userId);
  echo "
    <script type=\"text/javascript\">
    // <![CDATA[
      window.parent.location.hash='{$_POST['token']}';
      window.parent._{$_POST['token']} = JSON.parse('".str_replace("'","",json_encode($userData))."');
    // ]]>
    </script>
  ";
  
}
