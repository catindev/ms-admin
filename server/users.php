<?php
header('Content-Type: text/javascript');
header("Content-Type: application/json;charset=utf-8");
$session_correct = array("status"=>200,"username"=>"Имя Пользователя");
$session_error = array("status"=>400,"message"=>"Сессия устарела или не создавалась");
if (isset($_GET["user_session"])) {
  echo json_encode($session_correct, JSON_PRETTY_PRINT);
}
else {
  header('HTTP/1.1 403');
  echo json_encode($session_error, JSON_PRETTY_PRINT);
}
?>
