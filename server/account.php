<?php
header('Content-Type: text/javascript');
header("Content-Type: application/json;charset=utf-8");
$accounts = array("status"=>200,"items"=>[array('status'=>200,'id'=>"111",'name'=>'Студия Лаборатория'),array('status'=>200,'id'=>"222",'name'=>'Другая компания')]);
$session_error = array("status"=>403,"message"=>"Что-то пошло не так");
$server_error = array("status"=>500, "message"=>"Внутренняя ошибка");
preg_match_all("([0-9]{3})",$_SERVER['REQUEST_URI'],$id);
if (isset($_GET['user_session'])){
  for ($i=0; $i < count($accounts['items']); $i++){
    if ($id[0][0] == $accounts['items'][$i]['id']) {
      echo json_encode($accounts['items'][$i], JSON_PRETTY_PRINT);
    };
  }
}
else {
  header('HTTP/1.1 403');
  echo json_encode($session_error, JSON_PRETTY_PRINT);
}

?>
