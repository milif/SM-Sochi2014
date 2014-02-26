<?php

require_once __DIR__.'/../../lib/Auth.class.php';

if(isset($_GET['logout']) && $_GET['logout']){
    echo json_encode(array('success'=>Auth::logout()));
    exit;
}

require_once __DIR__.'/../../lib/LoginzaAPI.class.php';
if($_POST['token']) {
  $loginza = new LoginzaAPI;
  $userDataJson = json_encode($loginza->getAuthInfo($_POST['token']));
  $userData = json_decode($userDataJson, true);
  if(!Auth::login($_POST['token'], $userData['identity'], $userData)) exit();
  $userData['refKey'] = REF_KEY;
  echo "
    <script type=\"text/javascript\">
    // <![CDATA[
      window.parent.location.hash='{$_POST['token']}';
      window.parent._{$_POST['token']} = JSON.parse('".str_replace("'","",json_encode($userData))."');
    // ]]>
    </script>
  ";
  
}
