<?php
/**
 * Created by PhpStorm.
 * User: Iftekar
 * Date: 9/2/2016
 * Time: 4:15 PM
 */


//header('Content-type: text/html');
header('Content-Type: text/html; charset=utf-8');
//	header('Access-Control-Allow-Origin: http://*.torqkd.com');  //I have also tried the * wildcard and get the same response
header('Access-Control-Allow-Origin: *');  //I have also tried the * wildcard and get the same response
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');


list($type, $_POST['rawimage']) = explode(';', $_POST['rawimage']);
list(, $_POST['rawimage'])      = explode(',', $_POST['rawimage']);
$data = base64_decode($_POST['rawimage']);


file_put_contents('/uploads/event_image/thumb/'.$_POST['imagename'], $data);
$arr['filename']=$_POST['imagename'];
echo json_encode($arr);