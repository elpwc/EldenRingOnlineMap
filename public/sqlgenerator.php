<?php

function get_condition($condition)
{
    $res = '';
    if (@$condition[0] == '') { //字符串
        if (@$condition[1][1] != '') {
            $res .= '`' . $condition[1][0] . '`' . '="' . $condition[1][1] . '"';
        }
    } else if ($condition[0] == 'LIKE') {
        if ($condition[1][1] != '') {
            $res .= '`' . $condition[1][0] . '`' . ' LIKE "%' . $condition[1][1] . '%"';
        }
    } else {
        if (count($condition[1]) > 1) {
            $res .= '(';
            $tres = '';
            for ($i = 0; $i < count($condition[1]); $i++) {
                $tres =  get_condition($condition[1][$i]);
                $res .= $tres;
                if ($i < count($condition[1]) - 1 && $tres != '') {
                    $res .= " $condition[0] ";
                }
                $tres = '';
            }
            $res .= ')';
            if ($res == '()') {
                $res = '';
            }
        } else {
            @$res .= get_condition($condition[1][0]);
        }
    }
    return $res;
}
