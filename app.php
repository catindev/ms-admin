<?php
header("Content-Type: application/json");
mb_internal_encoding("UTF-8");
$login_correct = array('status'=>'200','session'=>'fb21257948461a14d065f414762517df');
$login_error = array('status'=>'400', 'message'=>'Неверный логин или пароль');
$server_error = array('status'=>'500', 'message'=>'Техническая ошибка. Попробуйте позже или обратитесь в поддержку.');
$request = json_decode(file_get_contents('php://input'),true);
if ($request['login'] == 'test' && $request['password']=='111') {
  echo json_encode($login_correct, JSON_UNESCAPED_UNICODE);
}
elseif ($request['login'] == 'badass' && $request['password']=='666') {
  header('HTTP/1.1 500');
  echo json_encode($server_error, JSON_UNESCAPED_UNICODE);
}
else {
  header('HTTP/1.1 400');
  echo json_encode($login_error, JSON_UNESCAPED_UNICODE);
}
?>
