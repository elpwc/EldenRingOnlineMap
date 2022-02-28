<?php

/**
 * 一些php工具方法
 * @author wniko
 */

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
