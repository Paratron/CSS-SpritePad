<?php

include 'lib/php/Model.php';

$model = new Model();
if(method_exists($model, $_GET['method'])){
    echo json_encode(call_user_func(array($model, $_GET['method']), $_POST['data']));
}