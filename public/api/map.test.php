<?php

/**
 * 地标后端
 */

require './private/dbcfg.php';
require './private/admin.php';
require './utils.php';
require './sqlgenerator.php';

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

$result = '';

switch ($request_type) {
    case 'GET':
        @$res = [
            'encrypt' => base64_encode(openssl_encrypt($_GET['text'], "AES-256-CBC", $passphrase= AESKEY, $_GET['pad'],$iv= AESIV)),
        ];

        echo json_encode($res);


        break;
}
