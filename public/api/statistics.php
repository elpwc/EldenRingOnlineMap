<?php

/**
 * 获取统计信息
 */

require './private/dbcfg.php';
require './utils.php';

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

$result = '';

switch ($request_type) {
    case 'GET':
        // @$content = trim((string)($data->content));
        $res = [
            'markerCount' => 0,
            'markerCountWithoutDeleted' => 0,
            'mostSearched' => [],
            'types' => []
        ];

        $sql = 'SELECT COUNT(*) AS "count" 
        FROM `map` 
        WHERE `is_deleted`=0;
        ';

        $result = mysqli_query($sqllink, $sql);

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $res['markerCountWithoutDeleted'] = $row['count'];
                $i++;
            }
        }


        $sql = 'SELECT COUNT(*) AS "count" 
        FROM `map` 
        ';

        $result = mysqli_query($sqllink, $sql);

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $res['markerCount'] = $row['count'];
                $i++;
            }
        }


        $sql = 'SELECT content, COUNT(*) as count from search where `position`="map" group by content order by count desc limit 10; 
        ';

        $result = mysqli_query($sqllink, $sql);

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                array_push($res['mostSearched'], [
                    'word' => $row['content'],
                    'count' => $row['count'],
                ]);
                $i++;
            }
        }


        $sql = 'SELECT `type`, COUNT(*) as count from map where `is_deleted`=0 group by `type` order by count desc;
        ';

        $result = mysqli_query($sqllink, $sql);

        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                array_push($res['types'], [
                    'word' => $row['type'],
                    'count' => $row['count'],
                ]);
                $i++;
            }
        }

        echo json_encode($res);
        break;
    default:
        break;
}
