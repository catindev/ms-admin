const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get("/users/:session_id", function (request, response) {
  const { session_id } = request.params;
  if (session_id) response.json({ status: 200, username: 'Василий Пупкин' })
  else response.status(403).json({
    status:403, message: 'Сессия устарела или не создавалась'
  });
});

app.get("/accounts", function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации'
  });

  response.json({
    status: 200,
    items:[
      { id: '111', name: 'Студия Лаборатория' },
      { id: '222', name: 'Агенство GPeople' },
      { id: '333', name: 'Зона отдыха Слобода' },
      { id: '444', name: 'Магазин Carpets' },
    ]
  });
});

app.get("/accounts/:accountID", function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации'
  });

  response.json({
    status: 200,
    id: '111',
    name: 'ТОО Рога и копыта'
  });
});

app.post("/login", function (request, response) {
  const { login, password } = request.body;

  if (login === 'badass') return response.status(500).json({
    status: 500, message: "Техническая ошибка. Попробуйте позже или обратитесь в поддержку"
  });

  if (login === 'test' && password === '111') return response.status(200).json({
    status: 200, session: 'fb21257948461a14d065f414762517df'
  });

  response.status(400).json({
    status: 400, message: "Неверный логин или пароль"
  });
});

var listener = app.listen(9999, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
