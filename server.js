const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/accounts', function (request, response) {
  response.sendFile(__dirname + '/accounts.html');
});

app.get('/accounts/:accountID', function (request, response) {
  response.sendFile(__dirname + '/account.html');
});

app.get('/accounts/:accountID/users', function (request, response) {
  response.sendFile(__dirname + '/users.html');
});

app.get('/accounts/:accountID/users/:userID', function (request, response) {
  response.sendFile(__dirname + '/user.html');
});

app.get('/accounts/:accountID/trunks', function (request, response) {
  response.sendFile(__dirname + '/trunks.html');
});

app.get('/accounts/:accountID/customfields', function(request, response){
  response.sendFile(__dirname + '/customfields.html');
});

app.get('/accounts/:accountID/customfields/:fieldID', function(request, response){
  response.sendFile(__dirname + '/customfield.html');
});

app.get('/api/users/:session_id', function (request, response) {
  const { session_id } = request.params;
  if (session_id) response.json({ status: 200, username: 'Василий Пупкин' });
  else response.status(403).json({
    status:403, message: 'Сессия устарела или не создавалась',
  });
});

app.get('/api/accounts', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  return response.json({
    status: 200,
    items:[]
  });

  response.json({
    status: 200,
    items:[
      { id: '111', name: 'Студия Лаборатория' },
      { id: '222', name: 'Агенство GPeople' },
      { id: '333', name: 'Зона отдыха Слобода' },
      { id: '444', name: 'Магазин Carpets' },
    ],
  });
});

app.get('/api/accounts/:accountID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
    id: '111',
    name: 'ТОО Рога и копыта',
    maxWaitingTime: 12000,
    maxConversationTime: 120000,
    targetQuestion: 'Клиент хотел купить?',
    author: 'Василий',
    created: '1 апреля 2017 в 18:30',
    funnelSteps: ['Встреча', 'Договор'],
    noTargetReasons: ['Ошиблись номером']
  });
});

app.post('/api/login', function (request, response) {
  const { login, password } = request.body;

  if (login === 'badass') return response.status(500).json({
    status: 500, message: 'Техническая ошибка. Попробуйте позже или обратитесь в поддержку',
  });

  if (login === 'test' && password === '111') return response.status(200).json({
    status: 200, session: 'fb21257948461a14d065f414762517df',
  });

  response.status(400).json({
    status: 400, message: 'Неверный логин или пароль',
  });
});

app.post('/api/accounts',function (request,response) {
  const { user_session } = request.query;
  const { name } = request.body;

  if (!user_session) return response.status(403).json({
    status: 403, message: 'Ошибка аутентификации',
  });
  if (!name) return response.status(400).json({
    status:400, message: 'Название аккаунта не заполнено',
  });

  response.json({
    status:200,
    id: '59c28264ee2f750c5848fde',
  });
});

app.put('/api/accounts/:accountID', function (request, response) {
  setTimeout(() => {
    const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации'
  });

  response.json({
    status:400,
    message: "Неправильно заполнен один из параметров",
    fields: [ "maxWaitingTime" ]
  });
}, 1100);
});

app.get('/api/accounts/:accountID/users', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
    items:[
      {
        id: '111',
        name: 'Иван',
      },
      {
        id: '222',
        name: 'Арай',
      },
      {
        id: '333',
        name: 'Елена',
      },
    ],
  });
});

app.post('/api/accounts/:accountID/users',function (request,response) {
  const { user_session } = request.query;
  const { name } = request.body;

  if (!user_session) return response.status(403).json({
    status: 403, message: 'Ошибка аутентификации',
  });

  if (!name) return response.status(400).json({
    status:400, message: 'Имя пользователя не заполнено',
  });

  response.json({
    status:200,
    id: '111',
  });
});

app.get('/api/accounts/:accountID/users/:userID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
    id: '111',
    name: 'Иван',
    phones: ['+77771234567', '+77785553311'],
    type: 'manager',
    email:'ivan@example.com',
  });
});

app.put('/api/accounts/:accountID/users/:userID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
  });
});

app.get('/api/accounts/:accountID/trunks', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
    items:[
      {
        id: '111',
        name: 'Google',
        phone: '+77770007722',
        active: true
      },
      {
        id: '222',
        name: 'Яндекс',
        phone: '+77058816622',
        active: true,
      },
      {
        id: '333',
        name: 'Instagram',
        phone: '+7701113456',
        active: false
      },
    ],
  });
});

app.post('/api/accounts/:accountID/trunks', function (request, response) {
  const { user_session } = request.query;
  const { name, phone } = request.body;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  if (!name) return response.status(400).json({
    status:400,
    message: "Не заполнено название транка",
    fields: [ "name" ]
  });

  if (!phone) return response.status(400).json({
    status:400,
    message: "Не заполнен номер транка",
    fields: [ "phone" ]
  });

  response.json({
    status: 200, id: new Date().getTime()
  });
});

app.get('/api/accounts/:accountID/trunks/:trunkID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
    id: '111',
    name: 'Google',
    phone: '+77770007722',
  });
});

app.put('/api/accounts/:accountID/trunks/:trunkID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
  });
});

app.delete('/api/accounts/:accountID/trunks/:trunkID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
  });
});

app.get('/api/accounts/:accountID/customfields', function(request, response){
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
     status: 200,
      items:[
        {
          id: '111',
          name: 'Пол',
        },
        {
          id: '222',
          name: 'Возраст',
        }
      ]
    });
});

app.post('/api/accounts/:accountID/customfields',function (request,response) {
  const { user_session } = request.query;
  const { name } = request.body;

  if (!user_session) return response.status(403).json({
    status: 403, message: 'Ошибка аутентификации',
  });

  if (!name) return response.status(400).json({
    status:400, message: 'Имя параметра не заполнено',
  });

  response.json({
    status:200,
    id: 'Идентификатор',
  });
});

app.get('/api/accounts/:accountID/customfields/:fieldID', function (request, response) {
  const { user_session } = request.query;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });

  response.json({
    status: 200,
    id: '333',
    name: 'Тестовый параметр',
    list: ['Значение 1', 'Значение 2'],
    type: 'select'
  });
});

app.put('/api/accounts/:accountID/customfields/:fieldID', function (request, response) {
  const { user_session } = request.query;
  const {type} = request.body;
  if (!user_session) return response.status(403).json({
    status:403, message: 'Ошибка аутентификации',
  });
  if (type === 'multiselect') return response.status(400).json({
    status:400,
    message: "Неправильно заполнен один из параметров",
    fields: [ "type" ]
  })
  response.json({
    status:200,
  });
});

var listener = app.listen(9999, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
