<?php
header('Content-Type: text/javascript');
header("Content-Type: application/json;charset=utf-8");
$accounts = array("status"=>200,"items"=>[json_decode('{"id":"111","name":"Одна компания"}'),array('id'=>"222",'name'=>'Другая компания')]);
$session_error = array("status"=>403,"message"=>"Что-то пошло не так");
if (isset($_GET['user_session'])){
  echo json_encode($accounts, JSON_PRETTY_PRINT);
}
else {
  header('HTTP/1.1 403');
  echo json_encode($session_error, JSON_PRETTY_PRINT);
}

?>
