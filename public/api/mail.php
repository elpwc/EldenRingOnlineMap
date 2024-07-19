<?php

/**
 * 邮件验证
 */

require './utils.php';

session_start();

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);

switch ($request_type) {
  case 'POST':
    @$email = trim((string)($data->email));

    $verify_code = mt_rand(100000, 999999);

    $_SESSION["verify_code"] = $verify_code;

    send_verification_mail($email, $verify_code);


    break;
  default:
    break;
}
