<?php

/**
 * 地标后端
 */

require './private/dbcfg.php';
require './private/admin.php';
require './utils.php';
require './sqlgenerator.php';

session_start();

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

$result = '';

switch ($request_type) {
  case 'POST':

    @$name = trim((string)($data->name));
    @$pw = trim((string)($data->pw));

    // user exist
    $sql = 'SELECT `name` FROM `user`
    WHERE `name`="' . $name . '" AND `pw`="' . $pw . '" AND `is_deleted`=0 AND `is_banned`=0
    ;';

    $result = mysqli_query($sqllink, $sql);
    if ($result->num_rows > 0) {
      // exist
      @$token = md5(((string)time()) + $name);
      $_SESSION["token"] = $token;
      echo json_encode(["res" => "ok", "token" => $token]);
    } else {
      // not exist
      echo json_encode(["res" => "fail"]);
    }
    break;
  case 'DELETE':
    // 退出登录
    unset($_SESSION['token']);
    session_destroy();
    break;
  default:
    break;
}
