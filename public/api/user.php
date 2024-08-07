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
    @$email = trim((string)($data->email));
    @$verify_code = trim((string)($data->verify_code));
    @$pw = trim((string)($data->pw));

    if ($_SESSION["verify_code"] != '' && $verify_code == $_SESSION["verify_code"]) {

      unset($_SESSION['verify_code']);

      // user exist
      $usersql = 'SELECT `name` FROM `user`
    WHERE `name`="' . $name . '" AND `is_deleted`=0
    ;';
      // email exist
      $emailsql = 'SELECT `email` FROM `user`
    WHERE `email`="' . $email . '" AND `is_deleted`=0
    ;';

      $user_result = mysqli_query($sqllink, $usersql);

      $email_result = mysqli_query($sqllink, $emailsql);

      if (($user_result->num_rows > 0) || ($email_result->num_rows > 0)) {
        // exist
        echo json_encode(["res" => "exist"]);
      } else {
        // not exist
        $sql = 'INSERT 
      INTO `user` (`name`, `pw`, `email`)
      VALUES ("' . $name . '","' . $pw . '","' . $email . '");
      ';

        $result = mysqli_query($sqllink, $sql);
        if ($result == true) {
          echo json_encode(["res" => "ok"]);
        } else {
          echo json_encode(["res" => "unknown_error"]);
        }
      }
    } else {
      echo json_encode(["res" => "verification_error"]);
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
