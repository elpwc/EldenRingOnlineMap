<?php

/**
 * 一些php工具方法
 * @author wniko
 */

require('./private/illegal_words_list.php');
require "./private/emailcfg.php";
require './plugin/Lib_Smtp.php';

/**
 * 防注入
 */
function anti_inj($text)
{
    $res = $text;
    $res = str_replace('\'', '', $res);
    $res = str_replace('"', '', $res);
    $res = str_replace('_', ' ', $res);

    $res = str_ireplace('<script', '<scramble', $res);
    $res = str_ireplace('<object', '<scramble', $res);
    $res = str_ireplace('<style', '<scramble', $res);
    $res = str_ireplace('<iframe', '<scramble', $res);
    $res = str_ireplace('<link', '<scramble', $res);

    return $res;
}

/**
 * 和谐
 */
function cator_to_cn_censorship($text)
{
    $res = $text;
    foreach (ILLEGAL_LIST as $word) {
        $res = str_ireplace($word, str_repeat('*', mb_strlen($word)), $res);
    }
    return $res;
}



function send_verification_mail($target, $verify_code)
{
    try {
        $mail = new Lib_Smtp();

        $mail->setServer(EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_PORT, true);
        $mail->setFrom(EMAIL_MAIL);
        $mail->setReceiver($target);
        $mail->addAttachment("");
        $mail->setMail(
            "老头环地图 邮箱验证码",
            '<h3>验证码是：<span>' . $verify_code . '</span></h3><p>有效期：5分钟</p>' . date('Y-m-d H:i:s')
        );
        return true;
    } catch (Exception $e) {
        return false;
    }
}
