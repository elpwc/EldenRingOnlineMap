<?php

/**
 * 搜索结果上传
 */

require './private/dbcfg.php';
require './utils.php';

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

$result = '';

switch ($request_type) {
    case 'POST':
        @$content = trim((string)($data->content));
        @$ip = trim((string)($data->ip));
        @$position = trim((string)($data->position));

        $sql = 'INSERT 
        INTO search (`content`, `ip`, `position`)
        VALUES ("' . anti_inj($content) . '","' . anti_inj($ip) . '","' . anti_inj($position) . '");
        ';

        $result = mysqli_query($sqllink, $sql);

        echo json_encode($result);
        break;
    default:
        break;
}
