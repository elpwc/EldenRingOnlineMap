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
  case 'POST':

    @$name = trim((string)($data->name));
    @$pw = trim((string)($data->pw));

    // user exist
    $sql = 'SELECT `name` FROM `user`
    WHERE `name`="' . $name . '" AND `is_deleted`=0
    ;';

    $result = mysqli_query($sqllink, $sql);

    if ($result->num_rows > 0) {
      // exist
      echo json_encode(["res" => "exist"]);
    } else {
      // not exist
      $sql = 'INSERT 
      INTO `user` (`name`, `pw`)
      VALUES ("' . $name . '","' . $pw . '");
      ';

      $result = mysqli_query($sqllink, $sql);
      if ($result == true) {
        echo json_encode(["res" => "ok"]);
      } else {
        echo json_encode(["res" => "unknown_error"]);
      }
    }
    break;
  case 'PATCH':

    break;
  case 'DELETE':
    @$id = trim((string)($data->id));

    $sql = "UPDATE user
    SET `is_deleted`=1
    WHERE `id`=$id;";

    $result = mysqli_query($sqllink, $sql);
    
    if ($result == true) {
      echo json_encode(["res" => "ok"]);
    } else {
      echo json_encode(["res" => "unknown_error"]);
    }

    break;
  default:
    break;
}
