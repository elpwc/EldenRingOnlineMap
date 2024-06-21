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
        @$type = trim((string)($data->type));
        @$name = trim((string)($data->name));
        @$desc = trim((string)($data->desc));
        @$lng = ($data->lng);
        @$lat = ($data->lat);
        @$like = ($data->like);
        @$dislike = ($data->dislike);
        @$ip = trim((string)($data->ip));
        @$is_underground = (string)($data->is_underground);
        @$position = (string)($data->position);
        @$x = ($data->x);
        @$y = ($data->y);

        $sql = 'INSERT 
        INTO map (`type`, `name`, `desc`, `lng`, `lat`, `like`, `dislike`, `ip`, `is_deleted`, `is_underground`, `position`, `x`, `y`)
        VALUES ("' . anti_inj($type) . '","' . cator_to_cn_censorship(anti_inj($name)) . '","' . cator_to_cn_censorship(anti_inj($desc)) . '","' . $lng . '","' . $lat . '","' . $like . '","' . $dislike . '","' . anti_inj($ip) . '", "0", "' . ($is_underground)  . '","' . $position  . '","' . $x . '","' . $y . '");
        ';

        $result = mysqli_query($sqllink, $sql);

        echo json_encode($result);
        break;
    case 'GET':
        @$id_ori = $_GET['id'];
        /** IP */
        @$ip_ori = $_GET['ip'];
        @$type_ori = $_GET['type'];
        @$kword_ori = $_GET['kword']; // | 隔开
        @$mapType_ori = $_GET['mapType'];
        /** 获取的属性，不填为全部 */
        @$queryType_ori = $_GET['queryType'];
        /** 获取的地表类型，不填为全部 */
        @$queryPosition_ori = $_GET['queryPosition'];

        @$x1_ori =  $_GET['x1'];
        @$y1_ori =  $_GET['y1'];
        @$x2_ori =  $_GET['x2'];
        @$y2_ori =  $_GET['y2'];

        $id = '';
        $ip = '';
        $type = '';
        $kword = '';
        $mapType = 0; //0 地面, 1 地下, 2 DLC1
        $queryType = '';
        $queryPosition = '';
        $count = '';
        $x1 = null;
        $y1 = null;
        $x2 = null;
        $y2 = null;


        if (is_numeric($x1_ori)) {
            $x1 = (int)$x1_ori;
        }
        if (is_numeric($y1_ori)) {
            $y1 = (int)$x1_ori;
        }
        if (is_numeric($x2_ori)) {
            $x2 = (int)$x2_ori;
        }
        if (is_numeric($y2_ori)) {
            $y2 = (int)$y2_ori;
        }


        if (is_numeric($queryType_ori)) {
            $queryType = (int)$queryType_ori;

            switch ($queryType) {
                case 0: // 获取全部信息
                    $count = '*';
                    break;
                case 1: // 只获取主要信息
                    $count = '`id`,`name`,`type`,`lng`,`lat`,`like`,`dislike`,`delete_request`';
                    break;
                case 2: // 获取lnglat
                    $count = '`id`,`name`, `desc`,`type`,`lng`,`lat`,`is_underground`,`position`,`is_lock`,`is_achievement`,`like`,`dislike`,`delete_request`,`ip`,`is_deleted`,`create_date`, `update_date`';
                    break;
                case 3: // 获取xy
                    $count = '`id`,`name`, `desc`,`type`,`x`,`y`,`is_underground`,`position`,`is_lock`,`is_achievement`,`like`,`dislike`,`delete_request`,`ip`,`is_deleted`,`create_date`, `update_date`';
                    break;
                default:
                    $count = '*';
                    break;
            }
        }

        if (is_numeric($id_ori)) {
            $id = (int)$id_ori;
        }
        if (is_numeric($mapType_ori)) {
            switch ($mapType_ori) {
                case 0:
                    $mapType = '0';
                    break;
                case 1:
                    $mapType = '1';
                    break;
                case 2:
                    $mapType = '2';
                    break;
                default:
                    break;
            }
        }
        if (isset($ip_ori)) {
            $ip = trim(anti_inj((string)$ip_ori));
        }
        $typearr = [];
        if (isset($type_ori)) {
            $type = trim(anti_inj((string)$type_ori));
            if ($type != '') {
                $types = explode('|', $type);
                if (is_string($types)) {
                    $types = [$type];
                }
                if (count($types) > 0) {
                    for ($i = 0; $i < count($types); $i++) {
                        array_push($typearr, ['', ['type', $types[$i]]]);
                    }
                }
            }
        }

        $positionarr = [];
        if (isset($queryPosition_ori)) {
            $queryPosition = trim(anti_inj((string)$queryPosition_ori));
            if ($queryPosition != '') {
                $positions = explode('|', $queryPosition);
                if (is_string($positions)) {
                    $positions = [$queryPosition];
                }
                if (count($positions) > 0) {
                    for ($i = 0; $i < count($positions); $i++) {
                        if ($positions[$i] === 'true') {
                            array_push($positionarr, ['', ['position', (string)$i]]);
                        }
                    }
                }
            }
        }


        $kwordarr = [];
        if (isset($kword_ori)) {
            $kword = trim(anti_inj((string)$kword_ori));
            if ($kword != '') {
                $kwords = explode('|', $kword);
                if (is_string($kwords)) {
                    $kwords = [[
                        'OR', [
                            ['LIKE', ['name', $kword]],
                            ['LIKE', ['desc', $kword]]
                        ]
                    ]];
                }
                if (count($kwords) > 0) {
                    for ($i = 0; $i < count($kwords); $i++) {
                        array_push($kwordarr, [
                            'OR', [
                                ['LIKE', ['name', $kwords[$i]]],
                                ['LIKE', ['desc', $kwords[$i]]]
                            ]
                        ]);
                    }
                }
            }
        }

        $rangearr = [];
        if ($x1 !== null && $x2 !== null && $y1 !== null && $y2 !== null) {
            array_push($rangearr, ['>', ['lat', $x1]]);
            array_push($rangearr, ['<', ['lat', $x2]]);
            array_push($rangearr, ['>', ['lng', $y1]]);
            array_push($rangearr, ['<', ['lng', $y2]]);
        }


        $select = [];

        if ($id <= 0) {
            $select = [
                'AND',
                [
                    ['OR', $typearr],
                    ['OR', $kwordarr],
                    ['OR', $positionarr],
                    ['', ['ip', $ip]],
                    ['', ['is_underground', $mapType]],
                    ['', ['is_deleted', '0']],
                    ['AND', $rangearr],
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
        FROM map
        $geneRes;
        ";

        //echo ($sql);

        $result = mysqli_query($sqllink, $sql);

        $res = [];


        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {

                @array_push($res, [
                    'id' => (int)$row['id'],
                    'type' => $row['type'],
                    'name' => $row['name'],
                    'desc' => $row['desc'],
                    'lng' => (float)$row['lng'],
                    'lat' =>  (float)$row['lat'],
                    'like' =>  (int)$row['like'],
                    'dislike' => (int)$row['dislike'],
                    'delete_request' => (int)$row['delete_request'],
                    'ip' => $row['ip'],
                    'is_deleted' => (bool)(int)$row['is_deleted'],
                    'mapType' => (int)$row['is_underground'],
                    'is_lock' => (bool)(int)$row['is_lock'],
                    'position' => (int)$row['position'],
                    'create_date' => $row['create_date'],
                    'update_date' => $row['update_date'],
                    'x' => $row['x'] == NULL ? 'null' : base64_encode(openssl_encrypt((string)$row['x'], "AES-256-CBC",  AESKEY, 1, $iv = AESIV)),
                    'y' => $row['y'] == NULL ? 'null' : base64_encode(openssl_encrypt((string)$row['y'], "AES-256-CBC",  AESKEY, 1, $iv = AESIV)),
                ]);
                $i++;
            }
        }

        echo json_encode($res);

        break;
    case 'DELETE':
        @$id = trim((string)($data->id));

        $sql = "UPDATE map
        SET `is_deleted`=1
        WHERE `id`=$id;";

        $result = mysqli_query($sqllink, $sql);

        echo ($result);

        break;
    case 'PATCH':
        @$id = property_exists($data, 'id') ? trim((string)($data->id)) : null;
        @$type = property_exists($data, 'type') ? trim((string)($data->type)) : null;
        @$name = property_exists($data, 'name') ? trim((string)($data->name)) : null;
        @$desc = property_exists($data, 'desc') ? trim((string)($data->desc)) : null;
        @$lng = property_exists($data, 'lng') ? (string)($data->lng) : null;
        @$lat = property_exists($data, 'lat') ? (string)($data->lat) : null;
        @$like = property_exists($data, 'like') ? (string)($data->like) : null;
        @$dislike = property_exists($data, 'dislike') ? ($data->dislike) : null;
        @$delete_request = property_exists($data, 'delete_request') ? (string)($data->delete_request) : null;
        @$ip = property_exists($data, 'ip') ? trim((string)($data->ip)) : null;
        @$is_deleted = property_exists($data, 'is_deleted') ? (string)($data->is_deleted) : null;
        @$is_lock = property_exists($data, 'is_lock') ? (string)($data->is_lock) : null;
        @$is_underground = property_exists($data, 'is_underground') ? (string)($data->is_underground) : null;
        @$position = property_exists($data, 'position') ? (string)($data->position) : null;
        @$x = ($data->x);
        @$y = ($data->y);

        if ($is_deleted == 'false') $is_deleted = "0";
        if ($is_lock == 'false') $is_lock = "0";
        if ($is_underground == 'false') $is_underground = "0";

        $select = [
            ['type', $type],
            ['name', $name],
            ['desc', $desc],
            ['lng', $lng, true],
            ['lat', $lat, true],
            ['like', $like, true, 'increment'],
            ['dislike', $dislike, true, 'increment'],
            ['delete_request', $delete_request, true, 'increment'],
            ['ip', $ip],
            ['is_deleted', $is_deleted, true],
            ['is_lock', $is_lock, true],
            ['is_underground', $is_underground, true],
            ['position', $position, true],
            ['x', $x, true],
            ['y', $y, true],
        ];

        $geneRes = patch_condition($select);

        $sql = "UPDATE map
        SET $geneRes
        WHERE `id`=$id;";

        $result = mysqli_query($sqllink, $sql);

        echo ($result);
        break;
    default:
        break;
}
