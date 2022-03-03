<?php

/**
 * 向服务器上传结果
 */

require './private/dbcfg.php';
require './private/illegal_words_list.php';
require './utils.php';
require './sqlgenerator.php';

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8');

$result = '';

switch ($request_type) {
    case 'POST':
        @$pid = trim((string)($data->pid));
        @$content = trim((string)($data->content));
        @$like = ($data->like);
        @$dislike = ($data->dislike);
        @$ip = trim((string)($data->ip));

        $sql = 'INSERT 
        INTO apo_reply (`pid`, `content`, `like`, `dislike`, `ip`, `is_deleted`)
        VALUES ("' . anti_inj($pid) . '","' . cator_to_cn_censorship(anti_inj($content)) . '","' . $like . '","' . $dislike . '","' . anti_inj($ip) . '", "0");
        SELECT @@IDENTITY;
        ';

        $result = mysqli_query($sqllink, $sql);
        $res = [];

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                array_push($res, [
                    'id' => $row['@@identity'],
                ]);
                $i++;
            }
        }

        echo json_encode($res);
        break;
    case 'GET':
        @$id_ori = $_GET['id'];
        @$pid_ori = $_GET['pid'];
        /** IP */
        @$ip_ori = $_GET['ip'];
        /** 个数, 不填为全部 */
        @$count_ori = $_GET['count'];
        @$kword_ori = $_GET['kword'];

        $id='';
        $ip = '';
        $pid = 0;
        $count = 0;
        $kword = '';
        if (is_numeric($pid_ori)) {
            $pid = (int)$pid_ori;
        }
        if (is_numeric($count_ori)) {
            $count = (int)$count_ori;
        }
        if (is_numeric($id_ori)) {
            $id = (int)$id_ori;
        }

        if ($count == 0) {
            $count = '*';
        } else {
            $count = 'TOP ' . $count;
        }
        if (isset($ip_ori)) {
            $ip = trim(anti_inj((string)$ip_ori));
        }
        if (isset($kword_ori)) {
            $kword = trim(anti_inj((string)$kword_ori));
        }

        $select = [];

        if ($id <= 0) {        
            $select = [
                'AND',
                [
                    ['', ['pid', $pid]],
                    [
                        'OR', [
                            ['LIKE', ['content', $kword]]
                        ]
                    ],
                    ['', ['ip', $ip]],
                    ['', ['is_deleted', '0']]
                ]
            ];
        } else{
            $select =  ['', ['id', $id]];
        }

        $geneRes = get_condition($select);
        if ($geneRes != '') {
            $geneRes = "WHERE $geneRes";
        }

        $sql = "SELECT $count
        FROM apo_reply
        $geneRes
        ORDER BY `update_date` DESC;
        ";

        $result = mysqli_query($sqllink, $sql);

        $res = [];

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                array_push($res, [
                    'id' => $row['id'],
                    'pid' => $row['pid'],
                    'content' => $row['content'],
                    'like' =>  (int)$row['like'],
                    'dislike' => (int)$row['dislike'],
                    'ip' => $row['ip'],
                    'is_deleted' => (bool)(int)$row['is_deleted'],
                    'create_date' => $row['create_date'],
                    'update_date' => $row['update_date'],
                ]);
                $i++;
            }
        }

        echo json_encode($res);

        break;
    case 'DELETE':
        @$id = trim((string)($data->id));

        $sql = "UPDATE apo_reply
        SET `is_deleted`=1
        WHERE `id`=$id;";

        $result = mysqli_query($sqllink, $sql);

        echo ($result);

        break;
    case 'PATCH':
        @$id = trim((string)($data->id));
        @$pid = trim((string)($data->pid));
        @$content = trim((string)($data->name));
        @$like = (string)($data->like);
        @$dislike = ($data->dislike);
        @$ip = trim((string)($data->ip));
        @$is_deleted = (string)($data->is_deleted);

        if ($is_deleted == 'false') $is_deleted = "0";

        $select = [
            ['pid', $pid],
            ['content', $content],
            ['like', $like],
            ['dislike', $dislike],
            ['ip', $ip],
            ['is_deleted', $is_deleted],
        ];

        $geneRes = '';
        for ($i = 0; $i < count($select); $i++) {
            $item = $select[$i];
            if ($item[1] != '') {
                $geneRes .= "`$item[0]` = \"$item[1]\",";
            }
        }

        if (substr($geneRes, -1) == ',') {
            $geneRes = substr($geneRes, 0, strlen($geneRes) - 1);
        }

        $sql = "UPDATE apo_reply
        SET $geneRes
        WHERE `id`=$id;";

        $result = mysqli_query($sqllink, $sql);

        echo ($result);
        break;
    default:
        break;
}
