<?php

/**
 * 讯息后端
 */

require './private/dbcfg.php';
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
        @$title = trim((string)($data->title));
        @$content = trim((string)($data->content));
        @$like = ($data->like);
        @$dislike = ($data->dislike);
        @$ip = trim((string)($data->ip));
        @$type = trim((string)($data->type));

        $sql = 'INSERT 
        INTO apothegm (`title`, `content`, `like`, `dislike`, `ip`, `is_deleted`, `type`)
        VALUES ("' . cator_to_cn_censorship(anti_inj($title)) . '","' . cator_to_cn_censorship(anti_inj($content)) . '","' . $like . '","' . $dislike . '","' . anti_inj($ip) . '", "0", "' . anti_inj($type) . '");
        ';

        $result = mysqli_query($sqllink, $sql);

        echo json_encode($result);
        break;
    case 'GET':
        @$id_ori = $_GET['id'];
        /** IP */
        @$ip_ori = $_GET['ip'];
        /** 个数, 不填为全部 */
        @$count_ori = $_GET['count'];
        @$kword_ori = $_GET['kword'];
        @$type_ori = $_GET['type'];

        $id = '';
        $ip = '';
        $count = 0;
        $kword = '';
        $type = '';

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
        if (isset($type_ori)) {
            $type = trim(anti_inj((string)$type_ori));
        }
        if (isset($kword_ori)) {
            $kword = trim(anti_inj((string)$kword_ori));
        }

        $select = [];

        if ($id <= 0) {
            $select = [
                'AND',
                [
                    [
                        'OR', [
                            ['LIKE', ['title', $kword]],
                            ['LIKE', ['content', $kword]]
                        ]
                    ],
                    ['', ['ip', $ip]],
                    ['', ['type', $type]],
                    ['', ['is_deleted', '0']]
                ]
            ];
        } else {
            $select =  ['', ['id', $id]];
        }


        $geneRes = get_condition($select);
        if ($geneRes != '') {
            $geneRes = "WHERE $geneRes";
        }

        $sql = "SELECT $count
        FROM apothegm
        $geneRes
        ORDER BY `reply_date` DESC;
        ";

        $result = mysqli_query($sqllink, $sql);

        $res = [];

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $crtPid = $row['id'];
                $sql2 = "SELECT *
                FROM apo_reply
                WHERE `pid`='$crtPid' AND `is_deleted`='0'
                ORDER BY `create_date`;
                ";
                $replyResult = mysqli_query($sqllink, $sql2);

                $replies = [];

                if ($replyResult->num_rows > 0) {
                    $j = 0;
                    while ($row2 = $replyResult->fetch_assoc()) {
                        array_push($replies, [
                            'id' => $row2['id'],
                            'pid' => $row2['pid'],
                            'content' => $row2['content'],
                            'like' =>  (int)$row2['like'],
                            'dislike' => (int)$row2['dislike'],
                            'ip' => $row2['ip'],
                            'is_deleted' => (bool)(int)$row2['is_deleted'],
                            'create_date' => $row2['create_date'],
                            'update_date' => $row2['update_date'],
                        ]);
                        $j++;
                    }
                }


                array_push($res, [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'content' => $row['content'],
                    'type' => $row['type'],
                    'gesture' => (int)$row['gesture'],
                    'is_top' => (bool)(int)$row['is_top'],
                    'like' =>  (int)$row['like'],
                    'dislike' => (int)$row['dislike'],
                    'ip' => $row['ip'],
                    'is_deleted' => (bool)(int)$row['is_deleted'],
                    'create_date' => $row['create_date'],
                    'update_date' => $row['update_date'],
                    'reply_date' => $row['reply_date'],
                    'replies' => $replies
                ]);
                $i++;
            }
        }



        echo json_encode($res);

        break;
    case 'DELETE':
        @$id = trim((string)($data->id));

        $sql = "UPDATE apothegm
        SET `is_deleted`=1
        WHERE `id`=$id;";

        $result = mysqli_query($sqllink, $sql);

        echo ($result);

        break;
    case 'PATCH':
        @$id = property_exists($data, 'id') ? trim((string)($data->id)) : null;
        @$title = property_exists($data, 'title') ? trim((string)($data->title)) : null;
        @$content = property_exists($data, 'content') ? trim((string)($data->content)) : null;
        @$type = property_exists($data, 'type') ? trim((string)($data->type)) : null;
        @$gesture = property_exists($data, 'gesture') ? (string)($data->gesture) : null;
        @$like = property_exists($data, 'like') ?  (string)($data->like) : null;
        @$dislike = property_exists($data, 'dislike') ?  (string)($data->dislike) : null;
        @$ip = property_exists($data, 'ip') ? trim((string)($data->ip)) : null;
        @$is_deleted = property_exists($data, 'is_deleted') ?  (string)($data->is_deleted) : null;
        @$reply_date = property_exists($data, 'reply_date') ? (string)($data->reply_date) : null;

        if ($is_deleted == 'false') $is_deleted = "0";

        $select = [
            ['title', $title],
            ['content', $content],
            ['type', $type],
            ['gesture', $gesture, true],
            ['like', $like, true, 'increment'],
            ['dislike', $dislike, true, 'increment'],
            ['ip', $ip],
            ['is_deleted', $is_deleted, true],
            ['reply_date', $reply_date !== null ? 'FROM_UNIXTIME(' . $reply_date . ')' : null, true],
        ];

        $geneRes = patch_condition($select);

        $sql = "UPDATE apothegm
        SET $geneRes
        WHERE `id`=$id;";

        $result = mysqli_query($sqllink, $sql);

        echo $sql;

        echo ($result);
        break;
    default:
        break;
}
