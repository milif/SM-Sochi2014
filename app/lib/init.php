<?php
ob_start();
require __DIR__.'/../tpl/head.php';
$head = ob_get_contents();
ob_end_clean();
