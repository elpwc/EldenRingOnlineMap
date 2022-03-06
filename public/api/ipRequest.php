<?php

/**
 * 获取客户端ip
 */

 /** 获取客户端ip */
function getip(){
    $ip = false;
    if (!empty($_SERVER["HTTP_REMOTE_HOST"])) {
        $ip = $_SERVER["HTTP_REMOTE_HOST"];
    }
    $res = $ip ? $ip : $_SERVER['HTTP_X_REAL_IP'];
    if($res){
        return $res;
    }else{
        return 'unknown';
    }
}

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);

if($request_type == 'GET'){
    echo json_encode(["ip" => getip()]);
}
