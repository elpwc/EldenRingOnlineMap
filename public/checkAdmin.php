<?php

/**
 * 验证管理员密码喵
 * @author wniko
 */

// 导入机密文件喵
require('./private/admin.php');

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);

if ($request_type == 'POST') {
    @$password = trim((string)($data->p));;

    if ($password == ADMINPASSWORD) {
        echo json_encode(['validate' => true]);
    } else {
        echo json_encode(['validate' => false]);
    }
}
