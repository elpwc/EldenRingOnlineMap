<?php

/**
 * 邮件验证
 */

require './utils.php';

session_start();

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
